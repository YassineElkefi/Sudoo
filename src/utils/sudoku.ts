import { GridSize, Difficulty, SudokuCell } from "@/types/sudoku";

// ─── Grid helpers ────────────────────────────────────────────────────────────

export const createEmptyGrid = (size: GridSize): SudokuCell[][] =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      value: null,
      fixed: false,
      notes: new Set<number>(),
      isError: false,
      isHighlighted: false,
      isSelected: false,
      isSameValue: false,
      isFading: false
    }))
  );

export const getBoxDimensions = (size: GridSize): { boxW: number; boxH: number } => {
  if (size === 6) return { boxW: 3, boxH: 2 };
  const s = Math.sqrt(size);
  return { boxW: s, boxH: s };
};

export const isValidMove = (
  grid: (number | null)[][],
  row: number,
  col: number,
  value: number,
  size: number
): boolean => {
  for (let i = 0; i < size; i++) {
    if (i !== col && grid[row][i] === value) return false;
    if (i !== row && grid[i][col] === value) return false;
  }
  const { boxW, boxH } = getBoxDimensions(size as GridSize);
  const startRow = Math.floor(row / boxH) * boxH;
  const startCol = Math.floor(col / boxW) * boxW;
  for (let r = startRow; r < startRow + boxH; r++)
    for (let c = startCol; c < startCol + boxW; c++)
      if ((r !== row || c !== col) && grid[r][c] === value) return false;
  return true;
};

// ─── Solver ──────────────────────────────────────────────────────────────────

const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const solveSudoku = (grid: (number | null)[][], size: number): boolean => {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
        for (const n of nums) {
          if (isValidMove(grid, r, c, n, size)) {
            grid[r][c] = n;
            if (solveSudoku(grid, size)) return true;
            grid[r][c] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const countSolutions = (grid: (number | null)[][], size: number, limit = 2): number => {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) {
        let count = 0;
        for (let n = 1; n <= size; n++) {
          if (isValidMove(grid, r, c, n, size)) {
            grid[r][c] = n;
            count += countSolutions(grid, size, limit - count);
            grid[r][c] = null;
            if (count >= limit) return count;
          }
        }
        return count;
      }
    }
  }
  return 1;
};

// ─── Puzzle generator ────────────────────────────────────────────────────────

const removeCount: Record<Difficulty, Record<GridSize, number>> = {
  easy:   { 4: 6,  6: 14, 9: 36 },
  medium: { 4: 8,  6: 18, 9: 46 },
  hard:   { 4: 10, 6: 22, 9: 52 },
  expert: { 4: 11, 6: 24, 9: 58 },
};

export const generatePuzzle = (
  size: GridSize,
  difficulty: Difficulty
): { puzzle: SudokuCell[][]; solution: number[][] } => {
  const solution: (number | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  solveSudoku(solution, size);
  const solvedGrid = solution as number[][];

  const puzzle: (number | null)[][] = solvedGrid.map((r) => [...r]);
  const toRemove = removeCount[difficulty][size];
  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => [Math.floor(i / size), i % size])
  );

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= toRemove) break;
    const backup = puzzle[r][c];
    puzzle[r][c] = null;
    const copy = puzzle.map((row) => [...row]);
    if (countSolutions(copy, size) === 1) {
      removed++;
    } else {
      puzzle[r][c] = backup;
    }
  }

  const cellGrid: SudokuCell[][] = puzzle.map((row) =>
    row.map((val) => ({
      value: val,
      fixed: val !== null,
      notes: new Set<number>(),
      isError: false,
      isHighlighted: false,
      isSelected: false,
      isSameValue: false,
    }))
  );

  return { puzzle: cellGrid, solution: solvedGrid };
};

// ─── Serialization ───────────────────────────────────────────────────────────

export const serializeGrid = (grid: SudokuCell[][]): string =>
  JSON.stringify(
    grid.map((row) =>
      row.map((cell) => ({
        value: cell.value,
        fixed: cell.fixed,
        notes: Array.from(cell.notes),
        isError: cell.isError,
      }))
    )
  );

export const deserializeGrid = (data: string): SudokuCell[][] => {
  const parsed = JSON.parse(data);
  return parsed.map((row: any[]) =>
    row.map((cell: any) => ({
      ...cell,
      notes: new Set<number>(cell.notes),
      isHighlighted: false,
      isSelected: false,
      isSameValue: false,
    }))
  );
};

// ─── Highlight computation ───────────────────────────────────────────────────

export const computeHighlights = (
  grid: SudokuCell[][],
  selected: [number, number] | null,
  size: GridSize
): SudokuCell[][] => {
  const { boxW, boxH } = getBoxDimensions(size);
  return grid.map((row, r) =>
    row.map((cell, c) => {
      if (!selected)
        return { ...cell, isSelected: false, isHighlighted: false, isSameValue: false };
      const [sr, sc] = selected;
      const isSelected = r === sr && c === sc;
      const selVal = grid[sr][sc].value;
      const sameBox =
        Math.floor(r / boxH) === Math.floor(sr / boxH) &&
        Math.floor(c / boxW) === Math.floor(sc / boxW);
      const isHighlighted = r === sr || c === sc || sameBox;
      const isSameValue = !!selVal && cell.value === selVal && !isSelected;
      return { ...cell, isSelected, isHighlighted, isSameValue };
    })
  );
};

// ─── Completion helpers ──────────────────────────────────────────────────────

export const checkWin = (grid: SudokuCell[][], solution: number[][]): boolean =>
  grid.every((row, r) => row.every((cell, c) => cell.value === solution[r][c]));

/** Returns a count map: how many times each digit 1–size appears correctly on the board */
export const getDigitCounts = (grid: SudokuCell[][], solution: number[][]): Map<number, number> => {
  const counts = new Map<number, number>();
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell.value !== null && cell.value === solution[r]?.[c]) {
        counts.set(cell.value, (counts.get(cell.value) ?? 0) + 1);
      }
    })
  );
  return counts;
};

// Smart Notes helper
export const removeNotesFromPeers = (
  grid: SudokuCell[][],
  row: number,
  col: number,
  value: number,
  size: number
) => {
  const { boxW, boxH } = getBoxDimensions(size as GridSize);
  return grid.map((rCells, r) =>
    rCells.map((cell, c) => {
      const sameRow = r === row;
      const sameCol = c === col;
      const sameBox =
        Math.floor(r / boxH) === Math.floor(row / boxH) &&
        Math.floor(c / boxW) === Math.floor(col / boxW);

      if ((sameRow || sameCol || sameBox) && !(r === row && c === col)) {
        if (cell.notes.has(value)) {
          const newNotes = new Set(cell.notes);
          newNotes.delete(value);
          return { ...cell, notes: newNotes };
        }
      }

      return cell;
    })
  );
};