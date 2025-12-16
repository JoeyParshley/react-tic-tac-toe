
export type Player = 'X' | 'O';

export type Cell = 'empty' | Player;

export type CellIndex = 0 | 1 | 2;

export type Position = {
    row: CellIndex;
    col: CellIndex;
}

export type GameState = 'playing' | 'won' | 'draw';