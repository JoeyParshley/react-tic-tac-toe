import type { Board } from './Board';
import { createBoard } from './Board';
import { checkWin, getGameState, makeMove as makeMoveLogic } from './gameLogic';
import type { Player, Position, GameState } from './types';

/**
 * Game domain model that encapsulates board state, current player, and game status.
 * This is the main interface for managing game state.
 */
export class Game {
    private readonly board: Board;
    private readonly currentPlayer: Player;
    private readonly gameState: GameState;
    private readonly winner: Player | null;

    /**
     * Private constructor - use static factory methods to create instances
     * @param board - The current board state
     * @param currentPlayer - The player whose turn it is
     * @param gameState - The current game state (playing, won, draw)
     * @param winner - The winner if the game is won, null otherwise
     */
    private constructor(
        board: Board,
        currentPlayer: Player,
        gameState: GameState,
        winner: Player | null
    ) {
        this.board = board;
        this.currentPlayer = currentPlayer;
        this.gameState = gameState;
        this.winner = winner;
    }

    /**
     * Creates a new game instance with an empty board
     * @returns A new Game instance with X as the starting player
     */
    static createNewGame(): Game {
        const board = createBoard();
        const currentPlayer: Player = 'X';
        const gameState: GameState = 'playing';
        const winner: Player | null = null;

        return new Game(board, currentPlayer, gameState, winner);
    }

    /**
     * Makes a move at the specified position
     * @param position - The position to make the move at
     * @returns A new Game instance with the move applied and state updated
     * @throws Error if the move is invalid
     */
    makeMove(position: Position): Game {
        // Make the move using the game logic (validates move and returns new board)
        const newBoard = makeMoveLogic(this.board, position, this.currentPlayer);

        // Determine the new game state
        const newGameState = getGameState(newBoard);
        const newWinner = checkWin(newBoard);

        // Switch to the next player if game is still playing
        const nextPlayer: Player = this.currentPlayer === 'X' ? 'O' : 'X';

        return new Game(
            newBoard,
            newGameState === 'playing' ? nextPlayer : this.currentPlayer,
            newGameState,
            newWinner
        );
    }

    /**
     * Gets the current player (whose turn it is)
     * @returns The current player ('X' or 'O')
     */
    getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    /**
     * Gets the current game state
     * @returns The game state: 'playing', 'won', or 'draw'
     */
    getGameState(): GameState {
        return this.gameState;
    }

    /**
     * Gets the winner of the game
     * @returns The winning player ('X' or 'O') or null if no winner
     */
    getWinner(): Player | null {
        return this.winner;
    }

    /**
     * Gets the board state
     * @returns A copy of the board state
     */
    getBoard(): Board {
        // Return a deep copy to maintain immutability
        return this.board.map(row => [...row]);
    }
}

