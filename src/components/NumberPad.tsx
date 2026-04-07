"use client";

import { Theme } from "@/hooks/useTheme";
import { GridSize, SudokuCell } from "@/types/sudoku";
import { getDigitCounts } from "@/utils/sudoku";

interface Props {
  size: GridSize;
  grid: SudokuCell[][];
  solution: number[][];
  noteMode: boolean;
  theme: Theme;
  onInput: (n: number | null) => void;
  onToggleNotes: () => void;
}

export default function NumberPad({
  size,
  grid,
  solution,
  noteMode,
  theme,
  onInput,
  onToggleNotes,
}: Props) {
  const isDark = theme === "dark";
  const counts = getDigitCounts(grid, solution);

  const btnBase: React.CSSProperties = {
    width: "clamp(36px, 9vw, 48px)",
    height: "clamp(36px, 9vw, 48px)",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
    fontSize: "clamp(16px, 4vw, 22px)",
    fontWeight: 600,
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* Number buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "min(460px, calc(100vw - 32px))",
        }}
      >
        {Array.from({ length: size }, (_, i) => i + 1).map((n) => {
          const used = counts.get(n) ?? 0;
          const exhausted = used >= size;
          return (
            <button
              key={n}
              onClick={() => !exhausted && onInput(n)}
              disabled={exhausted}
              style={{
                ...btnBase,
                background: exhausted
                  ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
                  : isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)",
                color: exhausted
                  ? isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)"
                  : isDark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.82)",
                cursor: exhausted ? "default" : "pointer",
                textDecoration: exhausted ? "line-through" : "none",
                transform: "scale(1)",
                boxShadow: exhausted
                  ? "none"
                  : isDark
                  ? "0 2px 6px rgba(0,0,0,0.4)"
                  : "0 2px 6px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                if (!exhausted) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              title={exhausted ? `All ${n}s placed` : `Enter ${n}`}
            >
              {n}
              {/* Small count indicator */}
              {!exhausted && used > 0 && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 3,
                    right: 4,
                    fontSize: 7,
                    fontFamily: "monospace",
                    opacity: 0.4,
                    lineHeight: 1,
                  }}
                >
                  {size - used}
                </span>
              )}
            </button>
          );
        })}

        {/* Erase button */}
        <button
          onClick={() => onInput(null)}
          style={{
            ...btnBase,
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
            color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
            fontSize: 18,
            boxShadow: isDark ? "0 2px 6px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.08)",
          }}
          title="Erase"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          ⌫
        </button>
      </div>

      {/* Notes toggle */}
      <button
        onClick={onToggleNotes}
        style={{
          padding: "9px 22px",
          borderRadius: 20,
          border: `1.5px solid ${noteMode ? "#6366f1" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
          background: noteMode
            ? isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.12)"
            : "transparent",
          color: noteMode ? "#818cf8" : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
          cursor: "pointer",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ fontSize: 13 }}>✎</span>
        Notes {noteMode ? "On" : "Off"}
      </button>

      {/* Keyboard hint */}
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          opacity: 0.25,
          margin: 0,
          textAlign: "center",
        }}
      >
        Arrows / WASD · N notes · Space pause
      </p>
    </div>
  );
}