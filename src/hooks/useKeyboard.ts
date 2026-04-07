"use client";

import { useEffect } from "react";
import { GridSize } from "@/types/sudoku";

interface Options {
  size: GridSize;
  disabled: boolean;
  noteMode: boolean;
  onMove: (dr: number, dc: number) => void;
  onInput: (n: number | null) => void;
  onToggleNotes: () => void;
  onTogglePause: () => void;
}

export function useKeyboard({
  size,
  disabled,
  onMove,
  onInput,
  onToggleNotes,
  onTogglePause,
}: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when modal inputs are focused
      if ((e.target as HTMLElement).tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;

      const arrowMap: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
        w: [-1, 0], a: [0, -1], s: [1, 0], d: [0, 1],
      };

      if (arrowMap[e.key]) {
        e.preventDefault();
        onMove(...arrowMap[e.key]);
        return;
      }

      if (e.key === " ") { e.preventDefault(); onTogglePause(); return; }
      if (e.key === "n" || e.key === "N") { onToggleNotes(); return; }
      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        onInput(null); return;
      }

      if (disabled) return;

      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= size) {
        onInput(num);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [size, disabled, onMove, onInput, onToggleNotes, onTogglePause]);
}