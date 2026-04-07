"use client";

import { SudokuCell, GridSize } from "@/types/sudoku";
import { getBoxDimensions } from "@/utils/sudoku";
import { Theme } from "@/hooks/useTheme";

interface Props {
  grid: SudokuCell[][];
  size: GridSize;
  isPaused: boolean;
  isComplete: boolean;
  theme: Theme;
  onSelect: (r: number, c: number) => void;
  onResume: () => void;
}

export default function SudokuGrid({
  grid,
  size,
  isPaused,
  isComplete,
  theme,
  onSelect,
  onResume,
}: Props) {
  const isDark = theme === "dark";
  const { boxW, boxH } = getBoxDimensions(size);

  const noteGrid = Math.ceil(Math.sqrt(size));

  return (
    <div
      style={{
        position: "relative",
        width: "min(460px, calc(100vw - 32px))",
        aspectRatio: "1",
        margin: "0 auto",
      }}
    >
      {/* Outer shadow ring */}
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 10,
          boxShadow: isDark
            ? "0 0 0 1px rgba(255,255,255,0.12), 0 24px 64px rgba(0,0,0,0.8)"
            : "0 0 0 1px rgba(0,0,0,0.18), 0 24px 64px rgba(0,0,0,0.12)",
          pointerEvents: "none",
          zIndex: 2,
          borderRadius: 10,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
          background: isDark ? "#12121a" : "#fafaf8",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const rightBox = (c + 1) % boxW === 0 && c !== size - 1;
            const bottomBox = (r + 1) % boxH === 0 && r !== size - 1;
            const rightThin = !rightBox && c !== size - 1;
            const bottomThin = !bottomBox && r !== size - 1;

            let bg = "transparent";
            if (cell.isSelected)
              bg = isDark ? "rgba(129,140,248,0.38)" : "rgba(99,102,241,0.22)";
            else if (cell.isSameValue)
              bg = isDark ? "rgba(129,140,248,0.2)" : "rgba(99,102,241,0.12)";
            else if (cell.isHighlighted)
              bg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";

            const thickBorder = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
            const thinBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onSelect(r, c)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: bg,
                  cursor: "pointer",
                  transition: "background 0.1s",
                  aspectRatio: "1",
                  borderRight: rightBox
                    ? `2px solid ${thickBorder}`
                    : rightThin
                    ? `1px solid ${thinBorder}`
                    : "none",
                  borderBottom: bottomBox
                    ? `2px solid ${thickBorder}`
                    : bottomThin
                    ? `1px solid ${thinBorder}`
                    : "none",
                }}
              >
                {cell.value ? (
                  <span
                    style={{
                      fontSize: size === 9 ? "clamp(14px, 3.2vw, 22px)" : "clamp(16px, 4vw, 26px)",
                      fontWeight: cell.fixed ? 700 : 500,
                      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
                      color: cell.isError
                        ? "#ef4444"
                        : cell.fixed
                        ? isDark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)"
                        : isDark ? "#a5b4fc" : "#4f46e5",
                      userSelect: "none",
                      lineHeight: 1,
                      transition: "color 0.15s",
                    }}
                  >
                    {cell.value}
                  </span>
                ) : cell.notes.size > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: "2px",
                      display: "grid",
                      gridTemplateColumns: `repeat(${noteGrid}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: size }, (_, i) => i + 1).map((n) => (
                      <span
                        key={n}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "clamp(5px, 1vw, 8px)",
                          lineHeight: 1,
                          fontFamily: "monospace",
                          color: cell.notes.has(n)
                            ? isDark ? "rgba(165,180,252,0.75)" : "rgba(79,70,229,0.65)"
                            : "transparent",
                          userSelect: "none",
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Pause overlay */}
      {isPaused && !isComplete && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            background: isDark ? "rgba(12,12,18,0.82)" : "rgba(250,250,248,0.82)",
            zIndex: 5,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>⏸</div>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.5,
              margin: "0 0 20px",
              fontFamily: "monospace",
            }}
          >
            Paused
          </p>
          <button
            onClick={onResume}
            style={{
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            Resume
          </button>
        </div>
      )}
    </div>
  );
}