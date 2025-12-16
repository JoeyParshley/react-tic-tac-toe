import type { Cell, Position } from './types';

export type Board = Cell[][];

/**
 * Creates a new Board instance
 * @param state - Optional 3x3 array of cells to initialize the board with
 * @returns A new Board instance
 * @throws Error if state is not exactly 3x3
 */
export function createBoard(state?: Cell[][]): Board {
    if (state) {
        // Validate that state is exactly 3x3
        if (state.length !== 3 || state.some(row => row.length !== 3)) {
            throw new Error('Board state must be exactly 3x3');
        }
        // Deep copy to maintain immutability
        return state.map(row => [...row]);
    }
    // Initialize empty 3x3 board
    return [
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty']
    ];
}

/**
 * Returns the cell value at the given position
 * @param board - The board to query
 * @param position - The position to query (row and col must be 0-2)
 * @returns The cell value at the position
 * @throws Error if position is out of bounds
 */
export function getCell(board: Board, position: Position): Cell {
    validatePosition(position);
    return board[position.row][position.col];
}

/**
 * Returns a new Board instance with the cell updated (immutable operation)
 * @param board - The board to update
 * @param position - The position to update (row and col must be 0-2)
 * @param cell - The new cell value
 * @returns A new Board instance with the updated cell
 * @throws Error if position is out of bounds or cell is already occupied
 */
export function setCell(board: Board, position: Position, cell: Cell): Board {
    validatePosition(position);
    
    const currentCell = board[position.row][position.col];
    
    // Validate that cell is not already occupied (if setting to 'X' or 'O')
    if (cell !== 'empty' && currentCell !== 'empty') {
        throw new Error(`Cell at position (${position.row}, ${position.col}) is already occupied`);
    }

    // Create a deep copy of the board
    const newBoard = board.map(row => [...row]);
    newBoard[position.row][position.col] = cell;

    return newBoard;
}

/**
 * Checks if a cell is empty
 * @param board - The board to check
 * @param position - The position to check (row and col must be 0-2)
 * @returns true if the cell is empty, false otherwise
 * @throws Error if position is out of bounds
 */
export function isEmpty(board: Board, position: Position): boolean {
    validatePosition(position);
    return board[position.row][position.col] === 'empty';
}

/**
 * Returns a copy of the entire 3x3 grid
 * @param board - The board to copy
 * @returns A deep copy of the grid as a 2D array
 */
export function getAllCells(board: Board): Cell[][] {
    return board.map(row => [...row]);
}

/**
 * Validates that a position is within bounds (0-2 for both row and col)
 * @param position - The position to validate
 * @throws Error if position is out of bounds
 */
function validatePosition(position: Position): void {
    if (position.row < 0 || position.row > 2 || position.col < 0 || position.col > 2) {
        throw new Error(`Position (${position.row}, ${position.col}) is out of bounds. Row and col must be between 0 and 2.`);
    }
}
