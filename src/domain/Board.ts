import type { Cell, Position } from './types';
/**
 * Represents a 3x3 tic-tac-toe board
 * The board is represented as a 2D array of cells
 * The cells are represented as 'empty', 'X', or 'O'
 * The board is immutable and can be updated by setting cells
 * The board is validated to ensure that the:
 * - position is within bounds
 * - cell is not already occupied
 * - game is still in a playable state
 * - game is not already won
 * - game is not already drawn
 */
export class Board {
    private readonly grid: Cell[][]; // 2D array of cells

    /**
     * Initializes the board with a given state or an empty board
     * @param state - The state to initialize the board with (optional)
     * @throws Error if the state is not exactly 3x3
     */
    constructor(state?: Cell[][]) {
        if (state) {
            // Validate that state is exactly 3x3
            if (state.length !== 3 || state.some(row => row.length !== 3)) {
                throw new Error('Board state must be exactly 3x3');
            }
            // Deep copy to maintain immutability
            this.grid = state.map(row => [...row]);
        } else {
            // Initialize empty 3x3 board
            this.grid = [
                ['empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty']
            ];
        }
    }

    /**
     * Returns the cell value at the given position
     * @param position - The position to query (row and col must be 0-2)
     * @returns The cell value at the position
     * @throws Error if position is out of bounds
     */
    getCell(position: Position): Cell {
        this.validatePosition(position);
        return this.grid[position.row][position.col];
    }

    /**
     * Returns a new Board instance with the cell updated (immutable operation)
     * @param position - The position to update (row and col must be 0-2)
     * @param cell - The new cell value
     * @returns A new Board instance with the updated cell
     * @throws Error if position is out of bounds or cell is already occupied
     */
    setCell(position: Position, cell: Cell): Board {
        this.validatePosition(position);
        
        const currentCell = this.grid[position.row][position.col];
        
        // Validate that cell is not already occupied (if setting to 'X' or 'O')
        if (cell !== 'empty' && currentCell !== 'empty') {
            throw new Error(`Cell at position (${position.row}, ${position.col}) is already occupied`);
        }

        // Create a deep copy of the grid
        const newGrid = this.grid.map(row => [...row]);
        newGrid[position.row][position.col] = cell;

        return new Board(newGrid);
    }

    /**
     * Checks if a cell is empty
     * @param position - The position to check (row and col must be 0-2)
     * @returns true if the cell is empty, false otherwise
     * @throws Error if position is out of bounds
     */
    isEmpty(position: Position): boolean {
        this.validatePosition(position);
        return this.grid[position.row][position.col] === 'empty';
    }

    /**
     * Returns a copy of the entire 3x3 grid
     * @returns A deep copy of the grid as a 2D array
     */
    getAllCells(): Cell[][] {
        return this.grid.map(row => [...row]);
    }

    /**
     * Validates that a position is within bounds (0-2 for both row and col)
     * @param position - The position to validate
     * @throws Error if position is out of bounds
     */
    private validatePosition(position: Position): void {
        if (position.row < 0 || position.row > 2 || position.col < 0 || position.col > 2) {
            throw new Error(`Position (${position.row}, ${position.col}) is out of bounds. Row and col must be between 0 and 2.`);
        }
    }
}
