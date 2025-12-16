import { describe, it, expect, beforeEach } from 'vitest';
import { createBoard, getCell, setCell, isEmpty, getAllCells, type Board } from './Board';
import type { Cell } from './types';

describe('createBoard', () => {
    it('should create an empty 3x3 board when no state is provided', () => {
        const board = createBoard();
        
        expect(board).toHaveLength(3);
        expect(board[0]).toHaveLength(3);
        expect(board[1]).toHaveLength(3);
        expect(board[2]).toHaveLength(3);
        
        // All cells should be empty
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                expect(board[row][col]).toBe('empty');
            }
        }
    });

    it('should create a board with the provided state', () => {
        const state: Cell[][] = [
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ];
        const board = createBoard(state);
        
        expect(board).toEqual(state);
    });

    it('should create a deep copy of the provided state', () => {
        const state: Cell[][] = [
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ];
        const board = createBoard(state);
        
        // Modify the original state
        state[0][0] = 'O';
        
        // Board should not be affected
        expect(board[0][0]).toBe('X');
    });

    it('should throw an error if state is not 3x3 (wrong number of rows)', () => {
        const invalidState: Cell[][] = [
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O']
        ];
        
        expect(() => createBoard(invalidState)).toThrow('Board state must be exactly 3x3');
    });

    it('should throw an error if state is not 3x3 (wrong number of columns)', () => {
        const invalidState: Cell[][] = [
            ['X', 'O'],
            ['empty', 'X'],
            ['O', 'empty']
        ];
        
        expect(() => createBoard(invalidState)).toThrow('Board state must be exactly 3x3');
    });
});

describe('getCell', () => {
    let board: Board;

    beforeEach(() => {
        board = createBoard([
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ]);
    });

    it('should return the correct cell value at valid position', () => {
        expect(getCell(board, { row: 0, col: 0 })).toBe('X');
        expect(getCell(board, { row: 0, col: 1 })).toBe('O');
        expect(getCell(board, { row: 0, col: 2 })).toBe('empty');
        expect(getCell(board, { row: 1, col: 1 })).toBe('X');
        expect(getCell(board, { row: 2, col: 2 })).toBe('X');
    });

    it('should throw an error for out of bounds row (negative)', () => {
        // @ts-expect-error - testing invalid row type at runtime
        expect(() => getCell(board, { row: -1, col: 0 })).toThrow('out of bounds');
    });

    it('should throw an error for out of bounds row (too large)', () => {
        // @ts-expect-error - testing invalid row type at runtime
        expect(() => getCell(board, { row: 3, col: 0 })).toThrow('out of bounds');
    });

    it('should throw an error for out of bounds col (negative)', () => {
        // @ts-expect-error - testing invalid col type at runtime
        expect(() => getCell(board, { row: 0, col: -1 })).toThrow('out of bounds');
    });

    it('should throw an error for out of bounds col (too large)', () => {
        // @ts-expect-error - testing invalid col type at runtime
        expect(() => getCell(board, { row: 0, col: 3 })).toThrow('out of bounds');
    });
});

describe('setCell', () => {
    let board: Board;

    beforeEach(() => {
        board = createBoard([
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ]);
    });

    it('should return a new board with the cell updated', () => {
        const newBoard = setCell(board, { row: 0, col: 2 }, 'X');
        
        // Original board should be unchanged
        expect(getCell(board, { row: 0, col: 2 })).toBe('empty');
        
        // New board should have the updated cell
        expect(getCell(newBoard, { row: 0, col: 2 })).toBe('X');
    });

    it('should maintain immutability - original board unchanged', () => {
        const originalCell = getCell(board, { row: 1, col: 0 });
        const newBoard = setCell(board, { row: 1, col: 0 }, 'X');
        
        // Original board should be unchanged
        expect(getCell(board, { row: 1, col: 0 })).toBe(originalCell);
        
        // New board should have the update
        expect(getCell(newBoard, { row: 1, col: 0 })).toBe('X');
    });

    it('should allow setting empty cell to X', () => {
        const newBoard = setCell(board, { row: 0, col: 2 }, 'X');
        expect(getCell(newBoard, { row: 0, col: 2 })).toBe('X');
    });

    it('should allow setting empty cell to O', () => {
        const newBoard = setCell(board, { row: 1, col: 0 }, 'O');
        expect(getCell(newBoard, { row: 1, col: 0 })).toBe('O');
    });

    it('should allow setting occupied cell to empty', () => {
        const newBoard = setCell(board, { row: 0, col: 0 }, 'empty');
        expect(getCell(newBoard, { row: 0, col: 0 })).toBe('empty');
    });

    it('should throw an error when trying to set occupied cell to X', () => {
        expect(() => setCell(board, { row: 0, col: 0 }, 'X')).toThrow('already occupied');
    });

    it('should throw an error when trying to set occupied cell to O', () => {
        expect(() => setCell(board, { row: 0, col: 1 }, 'O')).toThrow('already occupied');
    });

    it('should throw an error for out of bounds position', () => {
        // @ts-expect-error Testing runtime error for out of bounds row
        expect(() => setCell(board, { row: 3, col: 0 }, 'X')).toThrow('out of bounds');
        // @ts-expect-error Testing runtime error for out of bounds col
        expect(() => setCell(board, { row: 0, col: 3 }, 'X')).toThrow('out of bounds');
    });
});

describe('isEmpty', () => {
    let board: Board;

    beforeEach(() => {
        board = createBoard([
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ]);
    });

    it('should return true for empty cells', () => {
        expect(isEmpty(board, { row: 0, col: 2 })).toBe(true);
        expect(isEmpty(board, { row: 1, col: 0 })).toBe(true);
        expect(isEmpty(board, { row: 2, col: 1 })).toBe(true);
    });

    it('should return false for occupied cells', () => {
        expect(isEmpty(board, { row: 0, col: 0 })).toBe(false);
        expect(isEmpty(board, { row: 0, col: 1 })).toBe(false);
        expect(isEmpty(board, { row: 1, col: 1 })).toBe(false);
        expect(isEmpty(board, { row: 2, col: 2 })).toBe(false);
    });

    it('should throw an error for out of bounds position', () => {
        // @ts-expect-error - testing invalid row type at runtime
        expect(() => isEmpty(board, { row: -1, col: 0 })).toThrow('out of bounds');
        // @ts-expect-error - testing invalid row type at runtime
        expect(() => isEmpty(board, { row: 3, col: 0 })).toThrow('out of bounds');
        // @ts-expect-error - testing invalid col type at runtime
        expect(() => isEmpty(board, { row: 0, col: -1 })).toThrow('out of bounds');
        // @ts-expect-error - testing invalid col type at runtime
        expect(() => isEmpty(board, { row: 0, col: 3 })).toThrow('out of bounds');
    });
});

describe('getAllCells', () => {
    it('should return a deep copy of the board', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['empty', 'X', 'O'],
            ['O', 'empty', 'X']
        ]);
        
        const cells = getAllCells(board);
        
        // Should have the same content
        expect(cells).toEqual(board);
        
        // Should be a deep copy (modifying cells should not affect board)
        cells[0][0] = 'O';
        expect(getCell(board, { row: 0, col: 0 })).toBe('X');
    });

    it('should return a 3x3 array', () => {
        const board = createBoard();
        const cells = getAllCells(board);
        
        expect(cells).toHaveLength(3);
        expect(cells[0]).toHaveLength(3);
        expect(cells[1]).toHaveLength(3);
        expect(cells[2]).toHaveLength(3);
    });
});

describe('Board immutability', () => {
    it('should maintain immutability across all operations', () => {
        const board1 = createBoard();
        const board2 = setCell(board1, { row: 0, col: 0 }, 'X');
        const board3 = setCell(board2, { row: 0, col: 1 }, 'O');
        
        // All boards should be independent
        expect(getCell(board1, { row: 0, col: 0 })).toBe('empty');
        expect(getCell(board1, { row: 0, col: 1 })).toBe('empty');
        
        expect(getCell(board2, { row: 0, col: 0 })).toBe('X');
        expect(getCell(board2, { row: 0, col: 1 })).toBe('empty');
        
        expect(getCell(board3, { row: 0, col: 0 })).toBe('X');
        expect(getCell(board3, { row: 0, col: 1 })).toBe('O');
    });
});

