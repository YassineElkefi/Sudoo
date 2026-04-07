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
  hintsUsed: number;
  maxHints: number;
  onInput: (n: number | null) => void;
  onToggleNotes: () => void;
  onHint: () => void;
}

export default function NumberPad({
  size,
  grid,
  solution,
  noteMode,
  theme,
  hintsUsed,
  maxHints,
  onInput,
  onToggleNotes,
  onHint,
}: Props) {
  const isDark = theme === "dark";
  const counts = getDigitCounts(grid, solution);
  const hintsLeft = maxHints - hintsUsed;
  const hintsExhausted = hintsLeft <= 0;

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
                boxShadow: exhausted
                  ? "none"
                  : isDark ? "0 2px 6px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.08)",
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

      {/* Action row: Notes + Hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notes toggle */}
        <button
          onClick={onToggleNotes}
          style={{
            padding: "9px 18px",
            borderRadius: 20,
            border: `1.5px solid ${noteMode ? "#6366f1" : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
            background: noteMode
              ? isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.12)"
              : "transparent",
            color: noteMode ? "#818cf8" : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
            cursor: "pointer",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
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

        {/* Hint button */}
        <button
          onClick={onHint}
          disabled={hintsExhausted}
          title={hintsExhausted ? "No hints left" : `Use a hint (${hintsLeft} left)`}
          style={{
            padding: "9px 18px",
            borderRadius: 20,
            border: `1.5px solid ${
              hintsExhausted
                ? isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
                : isDark ? "rgba(255,213,79,0.35)" : "rgba(161,120,0,0.3)"
            }`,
            background: hintsExhausted
              ? "transparent"
              : isDark ? "rgba(255,213,79,0.08)" : "rgba(255,213,79,0.12)",
            color: hintsExhausted
              ? isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)"
              : isDark ? "#ffd54f" : "#8a6500",
            cursor: hintsExhausted ? "not-allowed" : "pointer",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            fontFamily: "monospace",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
          onMouseEnter={(e) => {
            if (!hintsExhausted)
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {/* Inline lightbulb SVG */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <line x1="9" y1="18" x2="15" y2="18" />
            <line x1="10" y1="22" x2="14" y2="22" />
            <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6l-.7.5V18H9v-2.5l-.7-.5C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
          </svg>
          Hint
          {/* Pip dots showing hints remaining */}
          <span style={{ display: "flex", gap: 3, marginLeft: 2 }}>
            {Array.from({ length: maxHints }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: i < hintsLeft
                    ? isDark ? "#ffd54f" : "#8a6500"
                    : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                  transition: "background 0.3s",
                  display: "inline-block",
                }}
              />
            ))}
          </span>
        </button>
      </div>

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