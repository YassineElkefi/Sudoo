export type GridSize = 4 | 6 | 9;
export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface SudokuCell {
  value: number | null;
  fixed: boolean;
  notes: Set<number>;
  isError: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  isSameValue: boolean;
  isFading?: boolean;
}

export interface GameState {
  grid: SudokuCell[][];
  solution: number[][];
  size: GridSize;
  difficulty: Difficulty;
  mistakes: number;
  elapsedTime: number;
  isComplete: boolean;
  isLost: boolean;
  isPaused: boolean;
  selectedCell: [number, number] | null;
  noteMode: boolean;
}