import { describe, it, expect } from 'vitest';
import { Game } from './Game';
import type { Position } from './types';

describe('Game', () => {
    describe('createNewGame', () => {
        it('should create a new game with empty board', () => {
            const game = Game.createNewGame();
            const board = game.getBoard();

            // All cells should be empty
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    expect(board[row][col]).toBe('empty');
                }
            }
        });

        it('should start with X as the current player', () => {
            const game = Game.createNewGame();
            expect(game.getCurrentPlayer()).toBe('X');
        });

        it('should start with "playing" game state', () => {
            const game = Game.createNewGame();
            expect(game.getGameState()).toBe('playing');
        });

        it('should have no winner initially', () => {
            const game = Game.createNewGame();
            expect(game.getWinner()).toBeNull();
        });
    });

    describe('makeMove', () => {
        it('should make a valid move and switch to next player', () => {
            const game = Game.createNewGame();
            const newGame = game.makeMove({ row: 0, col: 0 });

            const board = newGame.getBoard();
            expect(board[0][0]).toBe('X');
            expect(newGame.getCurrentPlayer()).toBe('O');
        });

        it('should alternate players correctly', () => {
            let game = Game.createNewGame();

            // First move by X
            game = game.makeMove({ row: 0, col: 0 });
            expect(game.getCurrentPlayer()).toBe('O');

            // Second move by O
            game = game.makeMove({ row: 0, col: 1 });
            expect(game.getCurrentPlayer()).toBe('X');

            // Third move by X
            game = game.makeMove({ row: 1, col: 0 });
            expect(game.getCurrentPlayer()).toBe('O');
        });

        it('should throw an error when trying to move on an occupied cell', () => {
            const game = Game.createNewGame();
            const gameAfterMove = game.makeMove({ row: 0, col: 0 });

            expect(() => gameAfterMove.makeMove({ row: 0, col: 0 })).toThrow('already occupied');
        });

        it('should throw an error when trying to move after game is won', () => {
            let game = Game.createNewGame();

            // Make moves that result in X winning
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 0 }); // O
            game = game.makeMove({ row: 0, col: 1 }); // X
            game = game.makeMove({ row: 1, col: 1 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X wins

            expect(game.getGameState()).toBe('won');
            expect(game.getWinner()).toBe('X');
            expect(() => game.makeMove({ row: 2, col: 0 })).toThrow('game is already won');
        });

        it('should throw an error when trying to move after game is drawn', () => {
            let game = Game.createNewGame();

            // Make moves that result in a draw
            // X O X
            // X X O
            // O X O
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 2, col: 2 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X
            game = game.makeMove({ row: 2, col: 0 }); // O
            game = game.makeMove({ row: 1, col: 1 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 1 }); // X

            expect(game.getGameState()).toBe('draw');
            expect(game.getWinner()).toBeNull();
            // Game is already drawn, so we can't make another move
            expect(() => game.makeMove({ row: 0, col: 0 })).toThrow('game is already drawn');
        });

        it('should maintain immutability - original game unchanged', () => {
            const game = Game.createNewGame();
            const newGame = game.makeMove({ row: 0, col: 0 });

            // Original game board should still be empty
            const originalBoard = game.getBoard();
            expect(originalBoard[0][0]).toBe('empty');

            // New game board should have the move
            const newBoard = newGame.getBoard();
            expect(newBoard[0][0]).toBe('X');
        });

        it('should automatically detect win and update game state', () => {
            let game = Game.createNewGame();

            // Make moves that result in X winning horizontally
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 0 }); // O
            game = game.makeMove({ row: 0, col: 1 }); // X
            game = game.makeMove({ row: 1, col: 1 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X wins

            expect(game.getGameState()).toBe('won');
            expect(game.getWinner()).toBe('X');
            // Current player should remain X (the winner) since game is over
            expect(game.getCurrentPlayer()).toBe('X');
        });

        it('should automatically detect draw and update game state', () => {
            let game = Game.createNewGame();

            // Create a draw scenario
            // X O X
            // X X O
            // O X O
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 2, col: 2 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X
            game = game.makeMove({ row: 2, col: 0 }); // O
            game = game.makeMove({ row: 1, col: 1 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 1 }); // X

            expect(game.getGameState()).toBe('draw');
            expect(game.getWinner()).toBeNull();
        });

        it('should detect vertical win', () => {
            let game = Game.createNewGame();

            // X makes vertical win in first column
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 0, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 0 }); // X wins

            expect(game.getGameState()).toBe('won');
            expect(game.getWinner()).toBe('X');
        });

        it('should detect diagonal win', () => {
            let game = Game.createNewGame();

            // X makes diagonal win (top-left to bottom-right)
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 1 }); // X
            game = game.makeMove({ row: 0, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 2 }); // X wins

            expect(game.getGameState()).toBe('won');
            expect(game.getWinner()).toBe('X');
        });

        it('should detect anti-diagonal win', () => {
            let game = Game.createNewGame();

            // O makes anti-diagonal win (top-right to bottom-left)
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 0, col: 2 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 1 }); // O
            game = game.makeMove({ row: 0, col: 1 }); // X
            game = game.makeMove({ row: 2, col: 0 }); // O wins

            expect(game.getGameState()).toBe('won');
            expect(game.getWinner()).toBe('O');
        });
    });

    describe('getCurrentPlayer', () => {
        it('should return the current player', () => {
            const game = Game.createNewGame();
            expect(game.getCurrentPlayer()).toBe('X');

            const gameAfterMove = game.makeMove({ row: 0, col: 0 });
            expect(gameAfterMove.getCurrentPlayer()).toBe('O');
        });
    });

    describe('getGameState', () => {
        it('should return "playing" for a new game', () => {
            const game = Game.createNewGame();
            expect(game.getGameState()).toBe('playing');
        });

        it('should return "playing" during active gameplay', () => {
            let game = Game.createNewGame();
            game = game.makeMove({ row: 0, col: 0 });
            game = game.makeMove({ row: 1, col: 1 });

            expect(game.getGameState()).toBe('playing');
        });

        it('should return "won" when there is a winner', () => {
            let game = Game.createNewGame();
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 0 }); // O
            game = game.makeMove({ row: 0, col: 1 }); // X
            game = game.makeMove({ row: 1, col: 1 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X wins

            expect(game.getGameState()).toBe('won');
        });

        it('should return "draw" when the game is a draw', () => {
            let game = Game.createNewGame();
            // Create a draw
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 2, col: 2 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X
            game = game.makeMove({ row: 2, col: 0 }); // O
            game = game.makeMove({ row: 1, col: 1 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 1 }); // X

            expect(game.getGameState()).toBe('draw');
        });
    });

    describe('getWinner', () => {
        it('should return null for a new game', () => {
            const game = Game.createNewGame();
            expect(game.getWinner()).toBeNull();
        });

        it('should return null during active gameplay', () => {
            let game = Game.createNewGame();
            game = game.makeMove({ row: 0, col: 0 });
            game = game.makeMove({ row: 1, col: 1 });

            expect(game.getWinner()).toBeNull();
        });

        it('should return the winning player when game is won', () => {
            let game = Game.createNewGame();
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 0 }); // O
            game = game.makeMove({ row: 0, col: 1 }); // X
            game = game.makeMove({ row: 1, col: 1 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X wins

            expect(game.getWinner()).toBe('X');
        });

        it('should return null when game is a draw', () => {
            let game = Game.createNewGame();
            // Create a draw
            game = game.makeMove({ row: 0, col: 0 }); // X
            game = game.makeMove({ row: 2, col: 2 }); // O
            game = game.makeMove({ row: 0, col: 2 }); // X
            game = game.makeMove({ row: 2, col: 0 }); // O
            game = game.makeMove({ row: 1, col: 1 }); // X
            game = game.makeMove({ row: 0, col: 1 }); // O
            game = game.makeMove({ row: 1, col: 0 }); // X
            game = game.makeMove({ row: 1, col: 2 }); // O
            game = game.makeMove({ row: 2, col: 1 }); // X

            expect(game.getWinner()).toBeNull();
        });
    });

    describe('getBoard', () => {
        it('should return a copy of the board', () => {
            const game = Game.createNewGame();
            const board1 = game.getBoard();
            const board2 = game.getBoard();

            // Should be equal in content
            expect(board1).toEqual(board2);
            // But should be different objects (immutability)
            expect(board1).not.toBe(board2);
        });

        it('should return the updated board after a move', () => {
            const game = Game.createNewGame();
            const newGame = game.makeMove({ row: 1, col: 1 });
            const board = newGame.getBoard();

            expect(board[1][1]).toBe('X');
        });
    });
});

