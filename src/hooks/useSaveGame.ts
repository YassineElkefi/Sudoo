"use client";

import { useEffect } from "react";
import { GameState } from "@/types/sudoku";
import { serializeGrid, deserializeGrid } from "@/utils/sudoku";

const SAVE_KEY = "sudoku_save_v3";

export interface SavedGame {
  size: GameState["size"];
  difficulty: GameState["difficulty"];
  solution: number[][];
  gridData: string;
  mistakes: number;
  elapsedTime: number;
  isComplete: boolean;
  noteMode: boolean;
}

export function useSaveGame(state: GameState) {
  useEffect(() => {
    if (!state.solution.length) return;
    try {
      const payload: SavedGame = {
        size: state.size,
        difficulty: state.difficulty,
        solution: state.solution,
        gridData: serializeGrid(state.grid),
        mistakes: state.mistakes,
        elapsedTime: state.elapsedTime,
        isComplete: state.isComplete,
        noteMode: state.noteMode,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch {}
  }, [state]);
}

export function loadSavedGame(): (Omit<GameState, "selectedCell" | "isPaused"> & { isPaused: true }) | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved: SavedGame = JSON.parse(raw);
    return {
      size: saved.size,
      difficulty: saved.difficulty,
      solution: saved.solution,
      grid: deserializeGrid(saved.gridData),
      mistakes: saved.mistakes,
      elapsedTime: saved.elapsedTime,
      isComplete: saved.isComplete,
      noteMode: saved.noteMode,
      isPaused: true,
      selectedCell: null,
    };
  } catch {
    return null;
  }
}

export function clearSavedGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
}