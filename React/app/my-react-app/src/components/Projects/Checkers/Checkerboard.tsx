import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { GameStateCell } from 'src/models/GameStateCell'
import { useState } from 'react'

interface CheckerboardProps {
    quitGame: () => void
}

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

const newGameState: GameStateCell[][] = createFreshGameState();

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    const [gameState, setGameState] = useState<GameStateCell[][]>(newGameState); // DEFINE THIS, DO NOT USE <ANY>

    return (
        <>
            <div className={styles.MainWrap}>
                <h1>Checkers with Chester</h1>
                <GameMenu onQuit={quitGame}/>
                <div className={styles.Board}>
                {
                    gameState.map((row, idx) => {
                        const rowNum = idx + 1;
                        return (
                            <BoardRow rowNumber={rowNum} cells={row}/>
                        )
                    })
                }
                </div>
            </div>
        </>
    )
}