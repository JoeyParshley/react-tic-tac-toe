import type { Board } from './Board';
import { isEmpty, setCell } from './Board';
import type { Player, Position, GameState } from './types';

/**
 * Checks if a player has won the game
 * @param board - The board to check
 * @returns The winning player ('X' or 'O') or null if no winner
 */
export function checkWin(board: Board): Player | null {
    // Check rows
    for (let row = 0; row < 3; row++) {
        const cell = board[row][0];
        if (cell !== 'empty' && 
            board[row][0] === board[row][1] && 
            board[row][1] === board[row][2]) {
            return cell as Player;
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        const cell = board[0][col];
        if (cell !== 'empty' && 
            board[0][col] === board[1][col] && 
            board[1][col] === board[2][col]) {
            return cell as Player;
        }
    }

    // Check main diagonal (top-left to bottom-right)
    const mainDiagonalCell = board[0][0];
    if (mainDiagonalCell !== 'empty' && 
        board[0][0] === board[1][1] && 
        board[1][1] === board[2][2]) {
        return mainDiagonalCell as Player;
    }

    // Check anti-diagonal (top-right to bottom-left)
    const antiDiagonalCell = board[0][2];
    if (antiDiagonalCell !== 'empty' && 
        board[0][2] === board[1][1] && 
        board[1][1] === board[2][0]) {
        return antiDiagonalCell as Player;
    }

    return null;
}

/**
 * Checks if the game is a draw (board is full with no winner)
 * @param board - The board to check
 * @returns true if the game is a draw, false otherwise
 */
export function checkDraw(board: Board): boolean {
    // Check if there's a winner first
    if (checkWin(board) !== null) {
        return false;
    }

    // Check if board is full (no empty cells)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === 'empty') {
                return false;
            }
        }
    }

    return true;
}

/**
 * Determines the current game state
 * @param board - The board to check
 * @returns The current game state: 'playing', 'won', or 'draw'
 */
export function getGameState(board: Board): GameState {
    if (checkWin(board) !== null) {
        return 'won';
    }
    if (checkDraw(board)) {
        return 'draw';
    }
    return 'playing';
}

/**
 * Makes a move on the board with proper validation
 * @param board - The current board state
 * @param position - The position to make the move at
 * @param player - The player making the move ('X' or 'O')
 * @returns A new board with the move applied
 * @throws Error if the move is invalid (cell occupied, out of bounds, or game not in playable state)
 */
export function makeMove(board: Board, position: Position, player: Player): Board {
    // Validate that the game is still in a playable state
    const gameState = getGameState(board);
    if (gameState !== 'playing') {
        throw new Error(`Cannot make a move: game is already ${gameState === 'won' ? 'won' : 'drawn'}`);
    }

    // Validate that the cell is empty
    if (!isEmpty(board, position)) {
        throw new Error(`Cannot make a move: cell at position (${position.row}, ${position.col}) is already occupied`);
    }

    // Make the move by setting the cell
    return setCell(board, position, player);
}

