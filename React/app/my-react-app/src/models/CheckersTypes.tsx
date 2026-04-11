import React from 'react'

export type GameStateCell = {
    row: number,
    cell: number,
    piece: string
};

export type Coords = {
    row: number,
    cell: number
}

export type PlayerMove = {
    start: Coords
    end: Coords
}

export const ActiveCellContext = React.createContext<Coords>({
    row: -1,
    cell: -1
})