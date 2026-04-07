"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState, GridSize, Difficulty, SudokuCell } from "@/types/sudoku";
import {
  generatePuzzle,
  createEmptyGrid,
  computeHighlights,
  checkWin,
  removeNotesFromPeers
} from "@/utils/sudoku";
import { useTimer } from "./useTimer";
import { useSaveGame, loadSavedGame, clearSavedGame } from "./useSaveGame";
import { useSound } from "./useSound";

const defaultState = (): GameState => ({
  grid: createEmptyGrid(9),
  solution: [],
  size: 9,
  difficulty: "medium",
  mistakes: 0,
  elapsedTime: 0,
  isComplete: false,
  isLost: false,
  isPaused: false,
  selectedCell: null,
  noteMode: false,
});

const MAX_MISTAKES = 3;
const MAX_HINTS = 3;

export function useGameState() {
  const [state, setState] = useState<GameState>(defaultState);
  const [winAnimation, setWinAnimation] = useState(false);
  const [lossAnimation, setLossAnimation] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const { playCorrect } = useSound();

  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) {
      setState((prev) => ({ ...prev, ...saved }));
    } else {
      startNewGame(9, "medium");
    }
  }, []);

  useTimer({
    running:
      !state.isComplete &&
      !state.isPaused &&
      !state.isLost &&
      state.solution.length > 0,
    onTick: useCallback(() => {
      setState((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, []),
  });

  useSaveGame(state);

  const startNewGame = useCallback((size: GridSize, difficulty: Difficulty) => {
    clearSavedGame();
    const { puzzle, solution } = generatePuzzle(size, difficulty);

    setState({
      grid: puzzle,
      solution,
      size,
      difficulty,
      mistakes: 0,
      elapsedTime: 0,
      isComplete: false,
      isLost: false,
      isPaused: false,
      selectedCell: null,
      noteMode: false,
    });

    setHintsUsed(0);
    setWinAnimation(false);
    setLossAnimation(false);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setState((prev) => {
      if (prev.isPaused || prev.isComplete || prev.isLost) return prev;
      const highlighted = computeHighlights(prev.grid, [row, col], prev.size);
      return { ...prev, grid: highlighted, selectedCell: [row, col] };
    });
  }, []);

  const moveSelection = useCallback((dr: number, dc: number) => {
    setState((prev) => {
      if (prev.isLost) return prev;
      const sel = prev.selectedCell ?? [0, 0];
      const nr = Math.max(0, Math.min(prev.size - 1, sel[0] + dr));
      const nc = Math.max(0, Math.min(prev.size - 1, sel[1] + dc));
      const highlighted = computeHighlights(prev.grid, [nr, nc], prev.size);
      return { ...prev, grid: highlighted, selectedCell: [nr, nc] };
    });
  }, []);

  const inputValue = useCallback((num: number | null) => {
    setState((prev) => {
      if (!prev.selectedCell || prev.isComplete || prev.isPaused || prev.isLost)
        return prev;

      const [r, c] = prev.selectedCell;
      if (prev.grid[r][c].fixed) return prev;

      let newGrid: SudokuCell[][] = prev.grid.map((row) =>
        row.map((cell) => ({ ...cell, notes: new Set(cell.notes) }))
      );

      // Erase
      if (num === null) {
        newGrid[r][c].value = null;
        newGrid[r][c].isError = false;
        newGrid[r][c].notes.clear();
        return { ...prev, grid: computeHighlights(newGrid, [r, c], prev.size) };
      }

      // Note mode
      if (prev.noteMode) {
        const notes = newGrid[r][c].notes;
        if (newGrid[r][c].value) {
          newGrid[r][c].value = null;
          newGrid[r][c].isError = false;
        }
        notes.has(num) ? notes.delete(num) : notes.add(num);
        return { ...prev, grid: computeHighlights(newGrid, [r, c], prev.size) };
      }

      // Normal entry
      const isCorrect = prev.solution[r]?.[c] === num;

      newGrid[r][c].value = num;
      newGrid[r][c].notes.clear();
      newGrid[r][c].isError = !isCorrect;

      if (isCorrect) {
        newGrid = removeNotesFromPeers(newGrid, r, c, num, prev.size);
        playCorrect(); // 🔔 play sound on correct entry
      }

      if (!isCorrect) {
        newGrid[r][c].isFading = true;
        setTimeout(() => {
          setState((current) => {
            const updatedGrid = current.grid.map((row) =>
              row.map((cell) => ({ ...cell, notes: new Set(cell.notes) }))
            );
            if (current.grid[r][c].value === num && current.grid[r][c].isError) {
              updatedGrid[r][c].value = null;
              updatedGrid[r][c].isError = false;
              updatedGrid[r][c].isFading = false;
            }
            return {
              ...current,
              grid: computeHighlights(updatedGrid, [r, c], current.size),
            };
          });
        }, 2000);
      }

      const newMistakes = !isCorrect ? prev.mistakes + 1 : prev.mistakes;
      const isLost = newMistakes >= MAX_MISTAKES;
      const isComplete = isCorrect && checkWin(newGrid, prev.solution);

      if (isComplete) setWinAnimation(true);
      if (isLost) setLossAnimation(true);

      return {
        ...prev,
        grid: computeHighlights(newGrid, [r, c], prev.size),
        mistakes: newMistakes,
        isComplete,
        isLost,
      };
    });
  }, [playCorrect]);

  // ─── Hint ────────────────────────────────────────────────────────────────
  const useHint = useCallback(() => {
    setState((prev) => {
      if (
        !prev.selectedCell ||
        prev.isComplete ||
        prev.isPaused ||
        prev.isLost ||
        hintsUsed >= MAX_HINTS
      ) return prev;

      const [r, c] = prev.selectedCell;
      const cell = prev.grid[r][c];

      // Only hint on empty or wrong cells
      if (cell.fixed || cell.value === prev.solution[r]?.[c]) return prev;

      const correctVal = prev.solution[r]?.[c];
      if (!correctVal) return prev;

      let newGrid: SudokuCell[][] = prev.grid.map((row) =>
        row.map((cell) => ({ ...cell, notes: new Set(cell.notes) }))
      );

      newGrid[r][c].value = correctVal;
      newGrid[r][c].notes.clear();
      newGrid[r][c].isError = false;
      newGrid[r][c].fixed = true; // lock the hinted cell so it can't be overwritten
      newGrid = removeNotesFromPeers(newGrid, r, c, correctVal, prev.size);

      playCorrect();

      const isComplete = checkWin(newGrid, prev.solution);
      if (isComplete) setWinAnimation(true);

      setHintsUsed((h) => h + 1);

      return {
        ...prev,
        grid: computeHighlights(newGrid, [r, c], prev.size),
        isComplete,
      };
    });
  }, [hintsUsed, playCorrect]);

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const toggleNoteMode = useCallback(() => {
    setState((prev) => ({ ...prev, noteMode: !prev.noteMode }));
  }, []);

  const dismissWin = useCallback(() => setWinAnimation(false), []);
  const dismissLoss = useCallback(() => setLossAnimation(false), []);

  return {
    state,
    winAnimation,
    lossAnimation,
    hintsUsed,
    maxHints: MAX_HINTS,
    startNewGame,
    selectCell,
    moveSelection,
    inputValue,
    useHint,
    togglePause,
    toggleNoteMode,
    dismissWin,
    dismissLoss,
  };
}