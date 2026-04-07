"use client";

import { Difficulty } from "@/types/sudoku";
import { Theme } from "@/hooks/useTheme";
import { formatTime } from "@/utils/format";

interface Props {
  difficulty: Difficulty;
  mistakes: number;
  elapsedTime: number;
  isPaused: boolean;
  isComplete: boolean;
  theme: Theme;
  onTogglePause: () => void;
  onToggleTheme: () => void;
  onNewGame: () => void;
}

const difficultyStyle: Record<Difficulty, string> = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#f97316",
  expert: "#ef4444",
};

export default function GameHeader({
  difficulty,
  mistakes,
  elapsedTime,
  isPaused,
  isComplete,
  theme,
  onTogglePause,
  onToggleTheme,
  onNewGame,
}: Props) {
  const isDark = theme === "dark";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const mutedText = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <header
      style={{
        borderBottom: `1px solid ${border}`,
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 520,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left: title + difficulty */}
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.22em",
            fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
            textTransform: "uppercase",
          }}
        >
          Sudoo
        </h1>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 2,
            color: difficultyStyle[difficulty],
            fontFamily: "monospace",
          }}
        >
          {difficulty}
        </div>
      </div>

      {/* Center: mistakes + timer */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Mistake dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: mutedText }}>
            ×
          </span>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: i < mistakes ? "#ef4444" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onTogglePause}
            disabled={isComplete}
            style={{
              background: "none",
              border: "none",
              cursor: isComplete ? "default" : "pointer",
              opacity: isComplete ? 0.3 : 0.6,
              fontSize: 13,
              padding: 0,
              color: "inherit",
              lineHeight: 1,
            }}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <span
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.06em",
              minWidth: 52,
              textAlign: "right",
            }}
          >
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Right: theme + new game */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onToggleTheme}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: `1px solid ${border}`,
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
            cursor: "pointer",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
            color: "inherit",
          }}
          title="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        <button
          onClick={onNewGame}
          style={{
            padding: "0 14px",
            height: 34,
            borderRadius: 6,
            border: `1px solid ${border}`,
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
            cursor: "pointer",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            color: "inherit",
            transition: "background 0.15s",
          }}
        >
          New
        </button>
      </div>
    </header>
  );
}