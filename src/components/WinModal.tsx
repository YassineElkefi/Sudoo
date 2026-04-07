"use client";

import { Difficulty } from "@/types/sudoku";
import { Theme } from "@/hooks/useTheme";
import { formatTime } from "@/utils/format";

interface Props {
  difficulty: Difficulty;
  elapsedTime: number;
  mistakes: number;
  theme: Theme;
  onNewGame: () => void;
}

const diffColor: Record<Difficulty, string> = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#f97316",
  expert: "#ef4444",
};

const diffLabel: Record<Difficulty, string> = {
  easy: "Smooth sailing",
  medium: "Well done",
  hard: "Impressive",
  expert: "Legendary",
};

export default function WinModal({ difficulty, elapsedTime, mistakes, theme, onNewGame }: Props) {
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(12px)",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          background: isDark ? "#16161f" : "#ffffff",
          borderRadius: 20,
          padding: "40px 36px 36px",
          width: "100%",
          maxWidth: 320,
          textAlign: "center",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          animation: "winIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          color: isDark ? "#e8e6f0" : "#1a1825",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 4, animation: "bounce 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>🎉</div>

        <h2
          style={{
            margin: "0 0 4px",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
          }}
        >
          Solved!
        </h2>

        <p style={{ margin: "0 0 28px", fontSize: 12, color: diffColor[difficulty], letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
          {diffLabel[difficulty]}
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
          <div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.04em",
                color: "#6366f1",
              }}
            >
              {formatTime(elapsedTime)}
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, fontFamily: "monospace", marginTop: 3 }}>
              Time
            </div>
          </div>
          <div style={{ width: 1, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
          <div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "'Courier New', monospace",
                color: mistakes === 0 ? "#22c55e" : mistakes <= 2 ? "#f59e0b" : "#ef4444",
              }}
            >
              {mistakes}
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.4, fontFamily: "monospace", marginTop: 3 }}>
              Mistakes
            </div>
          </div>
        </div>

        <button
          onClick={onNewGame}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 10,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(99,102,241,0.45)",
          }}
        >
          Play Again
        </button>
      </div>

      <style>{`
        @keyframes winIn { from { opacity: 0; transform: scale(0.7) rotate(-4deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        @keyframes bounce { from { transform: scale(0.5); } 60% { transform: scale(1.25); } to { transform: scale(1); } }
      `}</style>
    </div>
  );
}