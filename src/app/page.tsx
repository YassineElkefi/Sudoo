"use client";

import { useState } from "react";
import { GridSize, Difficulty } from "@/types/sudoku";
import { useGameState } from "@/hooks/useGameState";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboard } from "@/hooks/useKeyboard";
import GameHeader from "@/components/GameHeader";
import SudokuGrid from "@/components/SudokuGrid";
import NumberPad from "@/components/NumberPad";
import NewGameModal from "@/components/NewGameModal";
import WinModal from "@/components/WinModal";
import LossModal from "@/components/LossModal";
import Footer from "@/components/Footer";

export default function Home() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [showNewGame, setShowNewGame] = useState(false);

  const {
    state,
    winAnimation,
    lossAnimation,
    startNewGame,
    selectCell,
    moveSelection,
    inputValue,
    togglePause,
    toggleNoteMode,
    dismissWin,
    dismissLoss,
    maxHints,
    hintsUsed,
    useHint
  } = useGameState();

  useKeyboard({
    size: state.size,
    disabled: state.isComplete || state.isPaused,
    noteMode: state.noteMode,
    onMove: moveSelection,
    onInput: inputValue,
    onToggleNotes: toggleNoteMode,
    onTogglePause: togglePause,
  });

  const handleNewGame = (size: GridSize, difficulty: Difficulty) => {
    startNewGame(size, difficulty);
    setShowNewGame(false);
  };

  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: isDark ? "#0f0f17" : "#f2f0eb",
        color: isDark ? "#e8e6f0" : "#1a1825",
        transition: "background 0.3s, color 0.3s",
        fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
      }}
    >
      <GameHeader
        difficulty={state.difficulty}
        mistakes={state.mistakes}
        elapsedTime={state.elapsedTime}
        isPaused={state.isPaused}
        isComplete={state.isComplete}
        theme={theme}
        onTogglePause={togglePause}
        onToggleTheme={toggleTheme}
        onNewGame={() => setShowNewGame(true)}
      />

      <main
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "24px 16px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <SudokuGrid
          grid={state.grid}
          size={state.size}
          isPaused={state.isPaused}
          isComplete={state.isComplete}
          theme={theme}
          onSelect={selectCell}
          onResume={togglePause}
        />

        <NumberPad
          size={state.size}
          grid={state.grid}
          solution={state.solution}
          noteMode={state.noteMode}
          theme={theme}
          onInput={inputValue}
          onToggleNotes={toggleNoteMode}
          hintsUsed={hintsUsed}
          maxHints={maxHints}
          onHint={useHint}
        />
      </main>

      {showNewGame && (
        <NewGameModal
          theme={theme}
          initialSize={state.size}
          initialDifficulty={state.difficulty}
          onStart={handleNewGame}
          onClose={() => setShowNewGame(false)}
        />
      )}

      {winAnimation && (
        <WinModal
          difficulty={state.difficulty}
          elapsedTime={state.elapsedTime}
          mistakes={state.mistakes}
          theme={theme}
          onNewGame={() => { dismissWin(); setShowNewGame(true); }}
        />
      )}

      {lossAnimation && (
        <LossModal
          difficulty={state.difficulty}
          elapsedTime={state.elapsedTime}
          mistakes={state.mistakes}
          theme={theme}
          onNewGame={() => { dismissLoss(); setShowNewGame(true); }}
          //onRetry={() => startNewGame(state.size, state.difficulty)}
        />
      )}
      <Footer theme={theme} />
    </div>
  );
}