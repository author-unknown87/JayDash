import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { GameStateCell, Coords, ActiveCellContext, Move } from '../../../models/CheckersTypes'
import { useState } from 'react'

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

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    // ----- Use State Definitions ----- //
    const [gameState, setGameState] = useState<GameStateCell[][]>(newGameState);

    const [activeCell, setActiveCell] = useState<Coords>({row: -1, cell: -1});

    // ----- Component Methods ----- //

    //** Clear game state to reset pieces */
    function restart() {
        setGameState(newGameState);
    }

    function updateGameState(newSpaceCoords:Coords, oldSpaceCoords:Coords, piece: string) {
        setGameState((currentState) => {
            const updatedState = currentState.map(row => 
                row.map(cell => ({...cell}))
            )
            updatedState[newSpaceCoords.row][newSpaceCoords.cell].piece = piece;
            updatedState[oldSpaceCoords.row][oldSpaceCoords.cell].piece = "";
            return updatedState;
        })
    }

    function targetSpaceIsEmpty(move: Move):boolean {
        const pieceAtCell = gameState[move.coords.row][move.coords.cell].piece;
        return pieceAtCell === "";
    }

    function targetSpaceIsForwardDiagonal(move: Move):boolean {
        const startRow = gameState[activeCell.row][activeCell.cell].row;
        const startCell = gameState[activeCell.row][activeCell.cell].cell;

        const spaceIsForwardDiagonal = move.coords.row === startRow - 1 &&
                            (move.coords.cell === startCell - 1 ||
                                move.coords.cell === startCell + 1
                            );
        
        return spaceIsForwardDiagonal;
    }

    function validateMove(move: Move): boolean {
        const spaceIsEmpty = targetSpaceIsEmpty(move);
        // conditional: piece is not a King
        const spaceIsForwardDiagonal = targetSpaceIsForwardDiagonal(move);

        return (spaceIsEmpty && spaceIsForwardDiagonal);
    }

    function handlePuckClick(move: Move) {
        const isFirstClick = activeCell.cell === -1;
        const pieceAtLocation = gameState[move.coords.row][move.coords.cell].piece;

        if (isFirstClick) {
            if (pieceAtLocation === "B") {
                setActiveCell(move.coords);
            }
            return;
        }

        // handle 2nd click
        // validate move
        const moveIsValid = validateMove(move);
        // TODO: Handle this gracefully, with feedback to the user
        if (!moveIsValid) {
            setActiveCell({row: -1, cell: -1})
            return;
        }

        // We can safely assume player only plays Black pucks at this time
        updateGameState(move.coords, activeCell, "B"); 
        // clear coords
        setActiveCell({row: -1, cell: -1})
    }

    // ----- Component Render ----- //
    return (
        <>
            <div className={styles.MainWrap}>
                <h1>Checkers with Chester</h1>
                <GameMenu onQuit={quitGame} onRestart={restart}/>
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