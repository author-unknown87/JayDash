import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { GameState, GameStateCell, Coords, ActiveCellContext, Move, ActiveCell, PlayerMove } from '../../../models/CheckersTypes'
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
        case 2:
            return (evenSpace) ? "R" : "";
        case 1:
            return (!evenSpace) ? "R" : "";
        case 5:
        case 7:
            return (!evenSpace) ? "B" : "";
        case 6:
            return (evenSpace) ? "B" : "";
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
    for (let row = 0; row <= 7; row++) {
        for (let col = 0; col <= 7; col++) {
            board.rows[row][col].piece = ""
        }
    }

    board.rows[2][2].piece = "";
    board.rows[4][2].piece = "R";
    board.rows[5][3].piece = "B";
    board.rows[2][2].piece = "R";
    board.rows[1][5].piece = "BK";

    return board;
}

// ----- Local Constants ----- //

//const newGameState: GameState = createFreshGameState();
const newGameState: GameState = createTestGameState();
const defaultActiveCell: ActiveCell = {
    coords: {row: -1, cell: -1},
    piece: ""
}

const PLAYER = "player";
const CHESTER = "chester";

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    // ----- Use State Definitions ----- //
    const [gameState, setGameState] = useState<GameState>(newGameState);
    const [activeCell, setActiveCell] = useState<ActiveCell>(defaultActiveCell);
    const [playerTurn, setPlayerTurn] = useState<string>(PLAYER);
    const [gameOver, setGameOver] = useState<boolean>(false);

    // ----- Use Effect Definitions ----- //
    useEffect(() => {
        switch(gameState.whoMovedLast) {
            case PLAYER: 
                if (gameState.moveIsFinished) requestAIMove();
                break;
            case CHESTER:
                // Evaluate if player has any pieces / moves left
                const playerHasMoves = CheckIfPlayerHasMoves();
                if (!playerHasMoves) setGameOver(true);
                break;
        }

    }, [gameState])

    // ----- Component Methods ----- //

    //** Clear game state to reset pieces */
    function restart() {
        setGameState(newGameState);
        setActiveCell(defaultActiveCell)
        setPlayerTurn(PLAYER);
        setGameOver(false);
    }

    function CheckIfPlayerHasMoves(): boolean {
        const playerPieces = playerHasPiecesOnBoard();
        return playerPieces.length > 0;

        function playerHasPiecesOnBoard(): Coords[] {
            const playerPieces:Coords[] = [];

            gameState.rows.map((row, rowNumber) => {
                row.map((cell, cellNumber) => {
                    if (cell.piece.includes("B")) {
                        const coords:Coords = {
                            row: rowNumber,
                            cell: cellNumber
                        };

                        playerPieces.push(coords);
                    }
                })
            })

            return playerPieces;
        }
    }

    /** Checks for possibility of another jump move for the player */
    function CheckForAdditionalJumpChance(startSpace:Coords, piece:string, jumpedPieces: Coords[]):boolean {
        const isKing = piece.includes("K");
        const forwardRow = gameState.rows[startSpace.row - 2];
        const jumpedForwardRow = gameState.rows[startSpace.row - 1];

        if (!forwardRow && !isKing) return false;

        if (forwardRow) {
            // Check forward jump left
            var leftForwardIsValid = validateCoordinates(forwardRow, jumpedForwardRow, startSpace, true);
            if (leftForwardIsValid) return true;

            // Check forward jump right
            var rightForwardIsValid = validateCoordinates(forwardRow, jumpedForwardRow, startSpace, false);
            if (rightForwardIsValid) return true;
        }

        if (!isKing) return false;

        const backwardsRow = gameState.rows[startSpace.row + 2];
        const jumpedBackwardsRow = gameState.rows[startSpace.row + 1];
        if (!backwardsRow) return false;

        // IF KING check backward jump left
        var leftBackIsValid = validateCoordinates(backwardsRow, jumpedBackwardsRow, startSpace, true);
        if (leftBackIsValid) return true;

        // IF KING check backward jump right
        var rightBackIsValid = validateCoordinates(backwardsRow, jumpedBackwardsRow, startSpace, false);
        if (rightBackIsValid) return true;

        return false;

        /** Internal function only */
        function validateCoordinates(targetRow:GameStateCell[], jumpedRow:GameStateCell[], startSpace:Coords, isLeft:Boolean) {
            const cellSign = isLeft ? -1 : 1;

            const cell = targetRow[startSpace.cell + (2 * cellSign)];
            const jumpedSpace = jumpedRow[startSpace.cell + (1 * cellSign)];
            const jumpedAlready = jumpedSpace ? jumpedPieces.find(jp => jp.row === jumpedSpace.row && jp.cell === jumpedSpace.cell) : undefined;

            if (cell && cell.piece === "" && !jumpedAlready && jumpedSpace.piece.includes("R")) return true;

            return false;
        }
    }

    function updateGameState(newSpaceCoords:Coords, 
        oldSpaceCoords:Coords, 
        piece: string, 
        player: string,
        playerDoneMoving: boolean,
        jumpedPieces?: Coords[]
    ) {
        setGameState((currentState) => {
            const updatedState = {
                ...currentState,
                moveIsFinished: playerDoneMoving,
                rows: currentState.rows.map((row) => row.map(cell => ({...cell})))
            }

            // King the piece that moved if it was into a back row
            const isRed = piece.includes("R");
            const isKing = piece.includes("K");
            const redNeedsKing = isRed && !isKing && newSpaceCoords.row === 7;
            const blackNeedsKing = !isRed && !isKing && newSpaceCoords.row === 0;
            if (redNeedsKing || blackNeedsKing) piece += "K";

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

    async function requestAIMove() {
        const serializedBoard = JSON.stringify(gameState);
        const response = await FetchData({
            endpoint: "Checkers/GetMoveFromAI",
            action: "POST",
            postData: { BoardState: serializedBoard }
        }); 

        if (response.endOfGame) {
            setGameOver(true);
            return;
        }

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

        updateGameState(newSpace, oldSpace, piece, CHESTER, false, jumpedPieces);
        setPlayerTurn(PLAYER);
    }

    /** Finds all possible jump moves for the currently active piece */
    function findAllJumps(): PlayerMove[] {
        const jumpMoves: PlayerMove[] = [];

        const playerPieceLocations = gameState.rows.flatMap(r => r)
        .filter(c => c.piece.includes("B"))
        .map(c => ({
            row: c.row,
            cell: c.cell,
            piece: c.piece
        }));

        playerPieceLocations.forEach((p) => {
            // check upper left
            if (gameState.rows[p.row - 1][p.cell - 1].piece.includes("R") && 
                    gameState.rows[p.row - 2][p.cell - 2].piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row - 2, cell: p.cell - 2}})
            }

            // check upper right
            if (gameState.rows[p.row - 1][p.cell + 1].piece.includes("R") && 
                    gameState.rows[p.row - 2][p.cell + 2].piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row - 2, cell: p.cell + 2}})
            }

            // Guard: not a king, skip remaining checks
            if (!p.piece.includes("K")) return;

            // check lower left
            if (gameState.rows[p.row + 1][p.cell - 1].piece.includes("R") && 
                    gameState.rows[p.row + 2][p.cell - 2].piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row + 2, cell: p.cell - 2}})
            }

            // check lower right
            if (gameState.rows[p.row + 1][p.cell + 1].piece.includes("R") && 
                    gameState.rows[p.row + 2][p.cell + 2].piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row + 2, cell: p.cell + 2}})
            }

        })

        return jumpMoves;
    }

    function handlePuckClick(move: Move) {
        // Guard clause, prevent multiple player moves
        if (playerTurn === CHESTER) return;

        const isFirstClick = activeCell.coords.cell === -1;
        const isKing = activeCell.piece.includes("K");
        const pieceAtLocation = gameState.rows[move.coords.row][move.coords.cell].piece;

        if (isFirstClick) {
            if (pieceAtLocation.includes("B")) {
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

        // Check if player has a jump possible.
        const possibleJumpMoves = findAllJumps();
        if (possibleJumpMoves.length > 0) {
            // jumps are possible, player has to choose one of these available jumps
            const foundMove = possibleJumpMoves.filter(m => m.start.row == activeCell.coords.row && 
                m.start.cell == activeCell.coords.cell &&
                m.end.row == move.coords.row &&
                m.end.cell == move.coords.cell
            );

            if (foundMove.length == 0) {
                // TODO: this needs to be an error feedback
                setActiveCell(defaultActiveCell);
                return;
            }
        }

        const jumpedPieces: Coords[] = [];
        if (moveIsJump.isJump) {
            jumpedPieces.push(moveIsJump.jumpedPiece);
        }

        // TODO: Handle this gracefully, with feedback to the user
        if (!moveIsValid) {
            setActiveCell(defaultActiveCell)
            return;
        }

        // We can safely assume player only plays Black pucks
        let piece = activeCell.piece;
        if (move.coords.row === 0 && !piece.includes("K")) {
            piece = piece + "K";
        }

        // Check for additional moves if first move was a jump
        let additionalJumpAvailable = false;

        if (moveIsJump.isJump) {
            additionalJumpAvailable = CheckForAdditionalJumpChance(move.coords, piece, jumpedPieces);
        }

        updateGameState(move.coords, activeCell.coords, piece, PLAYER, !additionalJumpAvailable, jumpedPieces); 
        setActiveCell(defaultActiveCell);

        if (!additionalJumpAvailable) {
            setPlayerTurn(CHESTER);
        }
    }

    // ----- Component Render ----- //
    return (
        <>
            <div className={styles.MainWrap}>
                <div className={styles.GameAreaWrap}>
                    <h1>Checkers with Chester</h1>
                    <h2 className={!gameOver && styles.Hidden} >Game Over!</h2>
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
                        <div className={`${styles.MoveCue} ${playerTurn === PLAYER && styles.ActiveCue}`}>Your Move</div>
                        <div className={`${styles.MoveCue} ${playerTurn === CHESTER && styles.ActiveCue}`}>Chester's Move</div>
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