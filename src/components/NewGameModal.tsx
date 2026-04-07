"use client";

import { useState } from "react";
import { GridSize, Difficulty } from "@/types/sudoku";
import { Theme } from "@/hooks/useTheme";

interface Props {
  theme: Theme;
  initialSize: GridSize;
  initialDifficulty: Difficulty;
  onStart: (size: GridSize, difficulty: Difficulty) => void;
  onClose: () => void;
}

const SIZES: GridSize[] = [4, 6, 9];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "expert"];

const diffColor: Record<Difficulty, string> = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#f97316",
  expert: "#ef4444",
};

export default function NewGameModal({
  theme,
  initialSize,
  initialDifficulty,
  onStart,
  onClose,
}: Props) {
  const [size, setSize] = useState<GridSize>(initialSize);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const isDark = theme === "dark";

  const surface = isDark ? "#16161f" : "#ffffff";
  const overlay = "rgba(0,0,0,0.65)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const mutedText = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
  const pillBase: React.CSSProperties = {
    flex: 1,
    padding: "10px 0",
    borderRadius: 8,
    border: `1px solid ${border}`,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "monospace",
    transition: "all 0.15s",
    letterSpacing: "0.06em",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: overlay,
        backdropFilter: "blur(8px)",
        padding: "0 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: surface,
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 340,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          color: isDark ? "#e8e6f0" : "#1a1825",
        }}
      >
        <h2
          style={{
            margin: "0 0 28px",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
          }}
        >
          New Game
        </h2>

        {/* Size selector */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: mutedText, margin: "0 0 10px", fontFamily: "monospace" }}>
            Grid Size
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  ...pillBase,
                  background: size === s ? "#6366f1" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: size === s ? "#fff" : isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
                  borderColor: size === s ? "#6366f1" : border,
                  fontWeight: size === s ? 700 : 400,
                  boxShadow: size === s ? "0 4px 16px rgba(99,102,241,0.35)" : "none",
                }}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty selector */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: mutedText, margin: "0 0 10px", fontFamily: "monospace" }}>
            Difficulty
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  ...pillBase,
                  background: difficulty === d ? `${diffColor[d]}22` : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: difficulty === d ? diffColor[d] : isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)",
                  borderColor: difficulty === d ? diffColor[d] : border,
                  textTransform: "capitalize",
                  fontWeight: difficulty === d ? 700 : 400,
                  boxShadow: difficulty === d ? `0 4px 16px ${diffColor[d]}40` : "none",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(size, difficulty)}
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
            transition: "transform 0.12s, box-shadow 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(99,102,241,0.55)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(99,102,241,0.45)";
          }}
        >
          Start
        </button>
      </div>

      <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}