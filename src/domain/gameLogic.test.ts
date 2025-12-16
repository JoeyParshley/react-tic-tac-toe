import { describe, it, expect } from 'vitest';
import { createBoard, type Board } from './Board';
import { checkWin, checkDraw, getGameState, makeMove } from './gameLogic';
import type { Player, Position } from './types';

describe('checkWin', () => {
    it('should return null for an empty board', () => {
        const board = createBoard();
        expect(checkWin(board)).toBeNull();
    });

    it('should detect horizontal win in first row', () => {
        const board = createBoard([
            ['X', 'X', 'X'],
            ['O', 'O', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        expect(checkWin(board)).toBe('X');
    });

    it('should detect horizontal win in second row', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['O', 'O', 'O'],
            ['X', 'empty', 'empty']
        ]);
        expect(checkWin(board)).toBe('O');
    });

    it('should detect horizontal win in third row', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['O', 'X', 'empty'],
            ['X', 'X', 'X']
        ]);
        expect(checkWin(board)).toBe('X');
    });

    it('should detect vertical win in first column', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['X', 'O', 'empty'],
            ['X', 'empty', 'empty']
        ]);
        expect(checkWin(board)).toBe('X');
    });

    it('should detect vertical win in second column', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['X', 'O', 'empty'],
            ['empty', 'O', 'empty']
        ]);
        expect(checkWin(board)).toBe('O');
    });

    it('should detect vertical win in third column', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'O', 'X'],
            ['empty', 'empty', 'X']
        ]);
        expect(checkWin(board)).toBe('X');
    });

    it('should detect main diagonal win (top-left to bottom-right)', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['O', 'X', 'empty'],
            ['empty', 'empty', 'X']
        ]);
        expect(checkWin(board)).toBe('X');
    });

    it('should detect anti-diagonal win (top-right to bottom-left)', () => {
        const board = createBoard([
            ['X', 'O', 'O'],
            ['X', 'O', 'empty'],
            ['O', 'empty', 'empty']
        ]);
        expect(checkWin(board)).toBe('O');
    });

    it('should return null when there is no winner', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'X', 'O'],
            ['O', 'X', 'O']
        ]);
        expect(checkWin(board)).toBeNull();
    });

    it('should return null for a partially filled board with no winner', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['O', 'X', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        expect(checkWin(board)).toBeNull();
    });
});

describe('checkDraw', () => {
    it('should return false for an empty board', () => {
        const board = createBoard();
        expect(checkDraw(board)).toBe(false);
    });

    it('should return false when there is a winner', () => {
        const board = createBoard([
            ['X', 'X', 'X'],
            ['O', 'O', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        expect(checkDraw(board)).toBe(false);
    });

    it('should return false when board is not full', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'X', 'O'],
            ['O', 'X', 'empty']
        ]);
        expect(checkDraw(board)).toBe(false);
    });

    it('should return true when board is full with no winner', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'X', 'O'],
            ['O', 'X', 'O']
        ]);
        expect(checkDraw(board)).toBe(true);
    });

    it('should return true for a draw scenario', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'O', 'X'],
            ['O', 'X', 'O']
        ]);
        expect(checkDraw(board)).toBe(true);
    });
});

describe('getGameState', () => {
    it('should return "playing" for an empty board', () => {
        const board = createBoard();
        expect(getGameState(board)).toBe('playing');
    });

    it('should return "playing" for a partially filled board with no winner', () => {
        const board = createBoard([
            ['X', 'O', 'empty'],
            ['O', 'X', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        expect(getGameState(board)).toBe('playing');
    });

    it('should return "won" when there is a winner', () => {
        const board = createBoard([
            ['X', 'X', 'X'],
            ['O', 'O', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        expect(getGameState(board)).toBe('won');
    });

    it('should return "draw" when board is full with no winner', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'X', 'O'],
            ['O', 'X', 'O']
        ]);
        expect(getGameState(board)).toBe('draw');
    });
});

describe('makeMove', () => {
    it('should make a valid move on an empty cell', () => {
        const board = createBoard();
        const newBoard = makeMove(board, { row: 0, col: 0 }, 'X');
        
        expect(newBoard[0][0]).toBe('X');
        expect(board[0][0]).toBe('empty'); // Original board unchanged
    });

    it('should throw an error when trying to move on an occupied cell', () => {
        const board = createBoard([
            ['X', 'empty', 'empty'],
            ['empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        
        expect(() => makeMove(board, { row: 0, col: 0 }, 'O')).toThrow('already occupied');
    });

    it('should throw an error when trying to move after game is won', () => {
        const board = createBoard([
            ['X', 'X', 'X'],
            ['O', 'O', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        
        expect(() => makeMove(board, { row: 1, col: 2 }, 'O')).toThrow('game is already won');
    });

    it('should throw an error when trying to move after game is drawn', () => {
        const board = createBoard([
            ['X', 'O', 'X'],
            ['O', 'X', 'O'],
            ['O', 'X', 'O']
        ]);
        
        expect(() => makeMove(board, { row: 0, col: 0 }, 'X')).toThrow('game is already drawn');
    });

    it('should allow multiple moves in sequence', () => {
        let board = createBoard();
        
        board = makeMove(board, { row: 0, col: 0 }, 'X');
        board = makeMove(board, { row: 0, col: 1 }, 'O');
        board = makeMove(board, { row: 1, col: 1 }, 'X');
        
        expect(board[0][0]).toBe('X');
        expect(board[0][1]).toBe('O');
        expect(board[1][1]).toBe('X');
    });

    it('should maintain immutability - original board unchanged', () => {
        const board = createBoard([
            ['X', 'empty', 'empty'],
            ['empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty']
        ]);
        
        const newBoard = makeMove(board, { row: 0, col: 1 }, 'O');
        
        // Original board should be unchanged
        expect(board[0][1]).toBe('empty');
        
        // New board should have the move
        expect(newBoard[0][1]).toBe('O');
    });

    it('should allow moves until game is won', () => {
        let board = createBoard();
        
        // Make moves that lead to a win
        board = makeMove(board, { row: 0, col: 0 }, 'X');
        board = makeMove(board, { row: 1, col: 0 }, 'O');
        board = makeMove(board, { row: 0, col: 1 }, 'X');
        board = makeMove(board, { row: 1, col: 1 }, 'O');
        
        // This move should still be allowed (game not won yet)
        board = makeMove(board, { row: 0, col: 2 }, 'X');
        
        // Now game is won, next move should fail
        expect(() => makeMove(board, { row: 2, col: 0 }, 'O')).toThrow('game is already won');
    });

    it('should validate position bounds through isEmpty', () => {
        const board = createBoard();
        
        // @ts-expect-error - testing invalid position at runtime
        expect(() => makeMove(board, { row: 3, col: 0 }, 'X')).toThrow('out of bounds');
        
        // @ts-expect-error - testing invalid position at runtime
        expect(() => makeMove(board, { row: 0, col: -1 }, 'X')).toThrow('out of bounds');
    });
});

