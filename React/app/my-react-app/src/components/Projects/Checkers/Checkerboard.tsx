import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { GameState, GameStateCell, Coords, ActiveCellContext, Move, ActiveCell } from '../../../models/CheckersTypes'
import { useState, useEffect } from 'react'
import FetchData from '../../../hooks/FetchData'

// ----- Local Types ----- //

interface CheckerboardProps {
    quitGame: () => void
}

type MoveIsJumpResponse = {
    isJump: boolean,
    jumpedPiece?: Coords
}

// ----- Helper Methods ----- //

function determinePieceForDefaultState(row: number, cell: number): string {
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

function createFreshGameState(): GameState {
    const gameBoard: GameState = {
        whoMovedLast: "",
        rows: []
    }

    for (let rowIndex = 0; rowIndex <= 7; rowIndex++) {
        // rows
        const row: GameStateCell[] = []
        for (let cellIndex = 0; cellIndex <= 7; cellIndex++) {
            // cells
            const cell: GameStateCell = {
                row: rowIndex,
                cell: cellIndex,
                piece: determinePieceForDefaultState(rowIndex, cellIndex)
            }

            row.push(cell);
        }
        gameBoard.rows.push(row);
    }

    return gameBoard;
}

// TODO: DO NOT KEEP THIS IN PRODUCTION
function createTestGameState(): GameState {
    const board = createFreshGameState();

    // make adjustments
    for (let i = 0; i <= 7; i++) {
        board.rows[0][i].piece = ""
    }

    board.rows[1][5].piece = "";
    board.rows[1][7].piece = "";
    board.rows[0][6].piece = "R";
    board.rows[2][6].piece = "";
    board.rows[1][7].piece = "B";
    board.rows[3][5].piece = "RK";
    board.rows[2][2].piece = "";
    board.rows[3][3].piece = "R";
    board.rows[5][3].piece = "";
    board.rows[4][4].piece = "B";
    board.rows[5][1].piece = "";
    board.rows[3][1].piece = "B";
    board.rows[6][0].piece = "";
    board.rows[5][1].piece = "B";
    board.rows[6][4].piece = "";
    board.rows[5][3].piece = "B";

    return board;
}

// ----- Local Constants ----- //

//const newGameState: GameStateCell[][] = createFreshGameState();
const newGameState: GameState = createTestGameState();
const defaultActiveCell: ActiveCell = {
    coords: {row: -1, cell: -1},
    piece: ""
}

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    // ----- Use State Definitions ----- //
    const [gameState, setGameState] = useState<GameState>(newGameState);
    const [activeCell, setActiveCell] = useState<ActiveCell>(defaultActiveCell);

    // ----- Use Effect Definitions ----- //
    useEffect(() => {
        if (gameState.whoMovedLast === "B") {
            postMoveToBackend();
        }
    }, [gameState])

    // ----- Component Methods ----- //

    //** Clear game state to reset pieces */
    function restart() {
        setGameState(newGameState);
        setActiveCell(defaultActiveCell)
    }

    function updateGameState(newSpaceCoords:Coords, 
        oldSpaceCoords:Coords, 
        piece: string, 
        player: string,
        jumpedPieces?: Coords[]
    ) {
        setGameState((currentState) => {
            const updatedState = {
                ...currentState,
                rows: currentState.rows.map((row) => row.map(cell => ({...cell})))
            }

            updatedState.rows[newSpaceCoords.row][newSpaceCoords.cell].piece = piece;
            updatedState.rows[oldSpaceCoords.row][oldSpaceCoords.cell].piece = "";
            updatedState.whoMovedLast = player;

            // remove jumped piece, if any were jumped
            if (jumpedPieces && jumpedPieces.length > 0) {
                jumpedPieces.forEach((piece) => {
                    updatedState.rows[piece.row][piece.cell].piece = "";
                })
            }

            return updatedState;
        })
    }

    function targetSpaceIsEmpty(move: Move):boolean {
        const pieceAtCell = gameState.rows[move.coords.row][move.coords.cell].piece;
        return pieceAtCell === "";
    }

    function determineIfMoveIsJumpForKing(move: Move):MoveIsJumpResponse {
        const startCell = activeCell.coords.cell;
        const startRow = activeCell.coords.row;
        const jumpIsUp = activeCell.coords.row - move.coords.row > 0;

        // are they moving two spaces?
        if (Math.abs(move.coords.row - startRow) !== 2) return { isJump: false };
        if (Math.abs(move.coords.cell - startCell) !== 2) return { isJump: false };

        // is there a red piece in the way?
        const isJumpRight = activeCell.coords.cell - move.coords.cell < 0;
        const jumpedRow = jumpIsUp ? move.coords.row + 1 : move.coords.row - 1;
        const jumpedCell = (isJumpRight) ? activeCell.coords.cell + 1 : activeCell.coords.cell - 1;
        const jumpedPiece = gameState.rows[jumpedRow][jumpedCell].piece;

        if (jumpedPiece !== "R" && jumpedPiece !== "RK") return { isJump: false };

        return {isJump: true, jumpedPiece: {row: jumpedRow, cell: jumpedCell}};
    }

    function determineIfMoveIsJump(move: Move):MoveIsJumpResponse {
        const startCell = activeCell.coords.cell;
        const startRow = activeCell.coords.row;

        // are they moving two spaces ahead?
        if (move.coords.row - startRow !== -2) return { isJump: false };
        if (Math.abs(move.coords.cell - startCell) !== 2) return { isJump: false };

        // is there a red piece in the way?
        const isJumpRight = activeCell.coords.cell - move.coords.cell < 0;
        const jumpedRow = move.coords.row + 1;
        const jumpedCell = (isJumpRight) ? activeCell.coords.cell + 1 : activeCell.coords.cell - 1;
        const jumpedPiece = gameState.rows[jumpedRow][jumpedCell].piece;
        if (!jumpedPiece.includes("R")) return { isJump: false };

        return { isJump: true, jumpedPiece: {row: jumpedRow, cell: jumpedCell} };
    }

    function validateDirection(move: Move, isJump: boolean):boolean {
        const startRow = gameState.rows[activeCell.coords.row][activeCell.coords.cell].row;
        const startCell = gameState.rows[activeCell.coords.row][activeCell.coords.cell].cell;
        let isValid = false;

        isValid = move.coords.row === startRow - (isJump ? 2 : 1) &&
                            (move.coords.cell === startCell - (isJump ? 2 : 1) ||
                                move.coords.cell === startCell + (isJump ? 2 : 1)
                            );

        if (activeCell.piece.includes("K") && !isValid) {
            // King piece, may want to move backwards.  Check that as well
            isValid = move.coords.row === startRow + (isJump ? 2 : 1) &&
                            (move.coords.cell === startCell + (isJump ? 2 : 1) ||
                                move.coords.cell === startCell - (isJump ? 2 : 1)
                            );
        }
        
        return isValid;
    }

    function validateMove(move: Move, isJump: boolean): boolean {
        const spaceIsEmpty = targetSpaceIsEmpty(move);
        const directionIsValid = validateDirection(move, isJump);

        return (spaceIsEmpty && directionIsValid);
    }

    async function postMoveToBackend() {
        const serializedBoard = JSON.stringify(gameState);
        const response = await FetchData({
            endpoint: "Checkers/GetMoveFromAI",
            action: "POST",
            postData: { BoardState: serializedBoard }
        }); 

        console.log(response);

        // TODO: tie this to an actual model
        // TODO: check for errors and handle gracefully
        const lastIndex = response.move.positions.length - 1;
        const oldSpace:Coords = {
            row: response.move.positions[0].row,
            cell: response.move.positions[0].col
        };

        const newSpace:Coords = {
            row: response.move.positions[lastIndex].row,
            cell: response.move.positions[lastIndex].col
        };

        // TODO: figure out what this is from the original coordinates on the board
        const piece = response.pieceMoved;

        const jumpedPieces: Coords[] = [];
        response.move.jumpedPieces.forEach((piece) => {
            const jumpedPiece: Coords = {
                row: piece.row,
                cell: piece.col
            };

            jumpedPieces.push(jumpedPiece);
        })

        updateGameState(newSpace, oldSpace, piece, "R", jumpedPieces);
    }

    function handlePuckClick(move: Move) {
        const isFirstClick = activeCell.coords.cell === -1;
        const isKing = activeCell.piece.includes("K");
        const pieceAtLocation = gameState.rows[move.coords.row][move.coords.cell].piece;

        if (isFirstClick) {
            if (pieceAtLocation === "B" || pieceAtLocation === "BK") {
                setActiveCell({coords: move.coords, piece: pieceAtLocation});
            }
            return;
        }

        // handle 2nd click
        // Reset active cell if user is clicking another black puck
        if (pieceAtLocation.includes("B")) {
            setActiveCell({coords: {row: move.coords.row, cell: move.coords.cell}, piece: pieceAtLocation});
            return;
        }

        // validate move
        const moveIsJump = isKing ? determineIfMoveIsJumpForKing(move) : determineIfMoveIsJump(move);
        const moveIsValid = validateMove(move, moveIsJump.isJump);

        const jumpedPieces: Coords[] = [];
        if (moveIsJump.isJump) {
            jumpedPieces.push(moveIsJump.jumpedPiece);
        }

        // TODO: Handle this gracefully, with feedback to the user
        if (!moveIsValid) {
            setActiveCell(defaultActiveCell)
            return;
        }

        // We can safely assume player only plays Black pucks at this time
        let piece = activeCell.piece;
        if (move.coords.row === 0 && !piece.includes("K")) {
            piece = piece + "K";
        }
        updateGameState(move.coords, activeCell.coords, piece, "B", jumpedPieces); 
        // clear coords
        setActiveCell(defaultActiveCell)
    }

    // ----- Component Render ----- //
    return (
        <>
            <div className={styles.MainWrap}>
                <div className={styles.GameAreaWrap}>
                    <h1>Checkers with Chester</h1>
                    <GameMenu onQuit={quitGame} onRestart={restart}/>
                    <ActiveCellContext.Provider value={activeCell}>
                        <div className={styles.Board}>
                            {
                                gameState.rows.map((row, idx) => {
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
                <div className={styles.SecondColumn}>
                    <div className={styles.MoveTracker}>
                        <div className={styles.MoveCue}>Your Move</div>
                        <div className={`${styles.MoveCue} ${styles.ActiveCue}`}>Chester's Move</div>
                    </div>
                    <div className={styles.ChatWindow}>
                        <ul>
                            <li>I'm afraid I can't do that, Dave</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}