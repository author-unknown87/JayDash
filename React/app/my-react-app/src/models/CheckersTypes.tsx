import React from 'react'

export type GameState = {
    whoMovedLast: string,
    rows: GameStateCell[][]
}

export type GameStateCell = {
    row: number,
    cell: number,
    piece: string
};

export type Coords = {
    row: number,
    cell: number
}

export type Move = {
    coords: Coords,
    piece: string
}

export type PlayerMove = {
    start: Coords
    end: Coords
}

export type ActiveCell = {
    coords: Coords,
    piece: string
}

export const ActiveCellContext = React.createContext<ActiveCell>({
    coords: {
        row: -1,
        cell: -1
    },
    piece: ""
})