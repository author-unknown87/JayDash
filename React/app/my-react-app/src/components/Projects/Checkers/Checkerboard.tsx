import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { GameStateCell, PlayerMove, Coords, ActiveCellContext } from '../../../models/CheckersTypes'
import React, { useState, useEffect } from 'react'

// ----- Local Types ----- //

interface CheckerboardProps {
    quitGame: () => void
}

// ----- Helper Methods ----- //

function determinePiece(row: number, cell: number): string {
    const evenSpace = cell % 2 == 0;

    switch(row) {
        case 0:
            return (evenSpace) ? "R" : "";
        case 1:
            return (!evenSpace) ? "R" : "";
        case 2:
            return (evenSpace) ? "R" : "";
        case 5:
            return (!evenSpace) ? "B" : "";
        case 6:
            return (evenSpace) ? "B" : "";
        case 7:
            return (!evenSpace) ? "B" : "";
        default:
            return "";
    }
}

function createFreshGameState(): GameStateCell[][] {
    const board: GameStateCell[][] = []

    for (let rowIndex = 0; rowIndex <= 7; rowIndex++) {
        // rows
        const row: GameStateCell[] = []
        for (let cellIndex = 0; cellIndex <= 7; cellIndex++) {
            // cells
            const cell: GameStateCell = {
                row: rowIndex,
                cell: cellIndex,
                piece: determinePiece(rowIndex, cellIndex)
            }

            row.push(cell);
        }
        board.push(row);
    }

    return board;
}

// ----- Local Constants ----- //

const newGameState: GameStateCell[][] = createFreshGameState();
const defaultPlayerMove:PlayerMove = {
        start: {row: 0, cell: 0},
        end: {row: 0, cell: 0}
    }

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    // ----- Use State Definitions ----- //
    const [gameState, setGameState] = useState<GameStateCell[][]>(newGameState);
    const [playerMove, setPlayerMove] = useState<PlayerMove>(defaultPlayerMove);
    const [activeCell, setActiveCell] = useState<Coords>({row: -1, cell: -1});

    // ----- Use Effect Definitions ----- //
    useEffect(() => {
        validatePlayerMove();
    }, [playerMove])

    // ----- Component Methods ----- //
    function validatePlayerMove() {

    }

    function handlePuckClick(coords: Coords) {
        console.log("coords are ", coords.row, coords.cell);
        setActiveCell(coords);

        // first check if this is first or 2nd move click

            // if first, assign coords and exit

            // if second, assign coords and validate

                // if move is valid, update state

                // if move is invalid, provide feedback and clear player move
    }

    // ----- Component Render ----- //
    return (
        <>
            <div className={styles.MainWrap}>
                <h1>Checkers with Chester</h1>
                <GameMenu onQuit={quitGame}/>
                <ActiveCellContext.Provider value={activeCell}>
                    <div className={styles.Board}>
                        {
                            gameState.map((row, idx) => {
                                return (
                                    <BoardRow 
                                        rowNumber={idx} 
                                        cells={row}
                                        handleClick={handlePuckClick}
                                    />
                                )
                            })
                        }
                        </div>
                </ActiveCellContext.Provider>
            </div>
        </>
    )
}