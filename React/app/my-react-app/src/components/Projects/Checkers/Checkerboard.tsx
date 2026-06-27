import styles from './Checkerboard.module.scss'
import BoardRow from './BoardRow/BoardRow'
import GameMenu from './GameMenu/GameMenu'
import { 
    GameState,
    GameStateCell, 
    Coords, 
    GameSettingsContext, 
    Move, 
    ActiveCell, 
    PlayerMove,
    AIResponse,
    GameSettings
 } from '../../../models/CheckersTypes'
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

type validateCoordinatesResponse = {
    isValid: boolean,
    Coordinates: Coords
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
        rows: [],
        moveIsFinished: false
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

    board.rows[1][3].piece = "R"
    board.rows[3][3].piece = "R"
    board.rows[0][2].piece = "BK";

    return board;
}

// ----- Local Constants ----- //

const newGameState: GameState = createFreshGameState();
//const newGameState: GameState = createTestGameState();
const defaultActiveCell: ActiveCell = {
    coords: {row: -1, cell: -1},
    piece: ""
}
const defaultGameSettings:GameSettings = {
    ActiveCell: defaultActiveCell,
    Blocked: false
}

const PLAYER = "player";
const CHESTER = "chester";

export default function Checkerboard ({
    quitGame
}: CheckerboardProps) {
    // ----- Use State Definitions ----- //
    const [gameState, setGameState] = useState<GameState>(newGameState);
    const [gameSettings, setGameSettings] = useState<GameSettings>(defaultGameSettings);
    const [playerTurn, setPlayerTurn] = useState<string>(PLAYER);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [requiredMove, setRequiredMove] = useState<PlayerMove>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    // thinking animation state for AI
    const [thinkingDots, setThinkingDots] = useState<number>(0);
    const thinkingText = `Thinking${'.'.repeat(thinkingDots)}`;

    // ----- Use Effect Definitions ----- //
    useEffect(() => {
        switch(gameState.whoMovedLast) {
            case PLAYER: 
                if (gameState.moveIsFinished) {
                    setGameSettings(gs => ({
                        ...gs,
                        Blocked: true
                    }))
                    requestAIMove();
                }
                break;
            case CHESTER:
                // Evaluate if player has any pieces / moves left
                const playerHasMoves = CheckIfPlayerHasMoves();
                if (!playerHasMoves) setGameOver(true);
                break;
        }

    }, [gameState])

    // Reset the error message text after 5 seconds
    useEffect(() => {
        if (errorMessage !== "") {
            setTimeout(() => {
                setErrorMessage("");
            }, 5000)
        }
    }, [errorMessage])

    // Manage the "Thinking" animation while Chester (AI) is thinking
    useEffect(() => {
        let id: ReturnType<typeof setInterval> | undefined;

        if (playerTurn === CHESTER) {
            // reset and start interval
            setThinkingDots(0);
            id = setInterval(() => {
                setThinkingDots(d => (d + 1) % 4);
            }, 200);
        } else {
            // ensure reset when not thinking
            setThinkingDots(0);
        }

        return () => { if (id) clearInterval(id); }
    }, [playerTurn])

    // ----- Component Methods ----- //

    //** Clear game state to reset pieces */
    function restart() {
        setGameState(newGameState);
                setGameSettings(defaultGameSettings)
        setPlayerTurn(PLAYER);
        setGameOver(false);
        setRequiredMove(undefined)
        setErrorMessage("");
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

    /** Checks for possibility of another jump move for the player
     *  Now accepts an optional simulated board (rows) so callers can verify
     *  additional jumps against the board state that would exist after a jump
     *  is applied. This avoids relying on setState timing and fixes king multi-jumps.
     */
    function CheckForAdditionalJumpChance(startSpace:Coords, piece:string, jumpedPieces: Coords[], board?: GameStateCell[][]):CheckForAdditionalJumpChanceResponse {
        // prefer the provided simulated board, otherwise use the live gameState
        const rows = board ?? gameState.rows;

        const isKing = piece.includes("K");
        const forwardRow = rows[startSpace.row - 2];
        const jumpedForwardRow = rows[startSpace.row - 1];

        if (!forwardRow && !isKing) return buildReturn(startSpace);

        if (forwardRow) {
            // Check forward jump left
            var leftForwardIsValid = validateCoordinates(forwardRow, jumpedForwardRow, startSpace, true);
            if (leftForwardIsValid.isValid) {
                return buildReturn(startSpace, leftForwardIsValid);
            }

            // Check forward jump right
            var rightForwardIsValid = validateCoordinates(forwardRow, jumpedForwardRow, startSpace, false);
            if (rightForwardIsValid.isValid) return buildReturn(startSpace, rightForwardIsValid);
        }

        if (!isKing) return buildReturn(startSpace);

        const backwardsRow = rows[startSpace.row + 2];
        const jumpedBackwardsRow = rows[startSpace.row + 1];
        if (!backwardsRow) return buildReturn(startSpace);

        // IF KING check backward jump left
        var leftBackIsValid = validateCoordinates(backwardsRow, jumpedBackwardsRow, startSpace, true);
        if (leftBackIsValid.isValid) return buildReturn(startSpace, leftBackIsValid);

        // IF KING check backward jump right
        var rightBackIsValid = validateCoordinates(backwardsRow, jumpedBackwardsRow, startSpace, false);
        if (rightBackIsValid.isValid) return buildReturn(startSpace, rightBackIsValid);

        return buildReturn(startSpace);

        /** Internal Functions */

        function buildReturn(startSpace: Coords, validationResponse?: validateCoordinatesResponse):CheckForAdditionalJumpChanceResponse {
            const playerMove:PlayerMove = {
                start: startSpace,
                end: {
                    row: validationResponse?.Coordinates.row ?? -1,
                    cell: validationResponse?.Coordinates.cell ?? -1
                }
            };

            return {
                Exists: validationResponse?.isValid ?? false,
                PlayerMove: playerMove
            }
        }

        function validateCoordinates(targetRow:GameStateCell[] | undefined, jumpedRow:GameStateCell[] | undefined, startSpace:Coords, isLeft:Boolean):validateCoordinatesResponse {
            // guard missing rows
            if (!targetRow || !jumpedRow) return {isValid: false, Coordinates: {row: -1, cell: -1}};

            const cellSign = isLeft ? -1 : 1;
            const targetIndex = startSpace.cell + (2 * cellSign);
            const jumpedIndex = startSpace.cell + (1 * cellSign);

            const cell = targetRow[targetIndex];
            const jumpedSpace = jumpedRow[jumpedIndex];
            const jumpedAlready = jumpedSpace ? jumpedPieces.find(jp => jp.row === jumpedSpace.row && jp.cell === jumpedSpace.cell) : undefined;

            if (cell && cell.piece === "" && !jumpedAlready && jumpedSpace && jumpedSpace.piece.includes("R")) {
                return {
                    isValid: true,
                    Coordinates: {
                        row: cell.row,
                        cell: cell.cell
                    }
                }
            };

            return {isValid: false, Coordinates: {row: -1, cell: -1}};
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

    // Helper: wait for transitionend or timeout
    function waitForTransitionEnd(el: HTMLElement | null, timeout = 400): Promise<void> {
        return new Promise((resolve) => {
            if (!el) return resolve();
            let resolved = false;
            const onEnd = (e?: TransitionEvent) => {
                // accept transform or opacity transitions
                if (e && e.propertyName && e.propertyName !== 'transform' && e.propertyName !== 'opacity') return;
                if (resolved) return;
                resolved = true;
                el.removeEventListener('transitionend', onEnd);
                resolve();
            };
            el.addEventListener('transitionend', onEnd);
            setTimeout(() => { if (!resolved) { resolved = true; el.removeEventListener('transitionend', onEnd); resolve(); } }, timeout);
        });
    }

    // Fade out captured pieces (keep them in DOM until we update state)
    async function fadeCapturedPieces(jumpedPieces?: Coords[]) {
        if (!jumpedPieces || jumpedPieces.length === 0) return;
        const promises: Promise<void>[] = [];
        jumpedPieces.forEach(jp => {
            const sel = `[data-puck-row="${jp.row}"][data-puck-cell="${jp.cell}"]`;
            const el = document.querySelector(sel) as HTMLElement | null;
            if (el) {
                el.classList.add(styles.CapturedFade);
                promises.push(waitForTransitionEnd(el, 300));
            }
        });

        await Promise.all(promises);
    }

    // Perform FLIP animation for a move and handle fading captured pieces first
    async function performAnimatedMove(newSpaceCoords: Coords, oldSpaceCoords: Coords, pieceStr: string, playerStr: string, playerDoneMoving: boolean, jumpedPieces?: Coords[]) {
        // 1) Fade captured pieces visually (if any)
        if (jumpedPieces && jumpedPieces.length > 0) {
            await fadeCapturedPieces(jumpedPieces);
        }

        // 2) Capture source rect BEFORE we update the state
        const sourceSel = `[data-puck-row="${oldSpaceCoords.row}"][data-puck-cell="${oldSpaceCoords.cell}"]`;
        const sourceEl = document.querySelector(sourceSel) as HTMLElement | null;
        const sourceRect = sourceEl ? sourceEl.getBoundingClientRect() : null;

        // 3) Update the game state (this will remove captured pieces and render piece at destination)
        updateGameState(newSpaceCoords, oldSpaceCoords, pieceStr, playerStr, playerDoneMoving, jumpedPieces);

        // 4) If we captured a source rect, run FLIP to animate destination puck from source position
        if (sourceRect) {
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const destSel = `[data-puck-row="${newSpaceCoords.row}"][data-puck-cell="${newSpaceCoords.cell}"]`;
                        const destEl = document.querySelector(destSel) as HTMLElement | null;
                        if (!destEl) return resolve();

                        const destRect = destEl.getBoundingClientRect();
                        const deltaX = sourceRect.left - destRect.left;
                        const deltaY = sourceRect.top - destRect.top;

                        destEl.style.transition = 'none';
                        destEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        // force reflow
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        destEl.offsetHeight;

                        destEl.style.transition = 'transform 200ms cubic-bezier(.2,.9,.2,1)';
                        destEl.style.transform = 'translate(0, 0)';

                        const onEnd = (ev: TransitionEvent) => {
                            if (ev.propertyName !== 'transform') return;
                            destEl.style.transition = '';
                            destEl.style.transform = '';
                            destEl.removeEventListener('transitionend', onEnd);
                            resolve();
                        };
                        destEl.addEventListener('transitionend', onEnd);

                        // fallback cleanup
                        setTimeout(() => {
                            if (destEl) {
                                destEl.style.transition = '';
                                destEl.style.transform = '';
                            }
                            resolve();
                        }, 320);
                    });
                });
            });
        }
    }

    function targetSpaceIsEmpty(move: Move):boolean {
        const pieceAtCell = gameState.rows[move.coords.row][move.coords.cell].piece;
        return pieceAtCell === "";
    }

    function determineIfMoveIsJumpForKing(move: Move):MoveIsJumpResponse {
        const startCell = gameSettings.ActiveCell.coords.cell;
        const startRow = gameSettings.ActiveCell.coords.row;
        const jumpIsUp = gameSettings.ActiveCell.coords.row - move.coords.row > 0;

        // are they moving two spaces?
        if (Math.abs(move.coords.row - startRow) !== 2) return { isJump: false };
        if (Math.abs(move.coords.cell - startCell) !== 2) return { isJump: false };

        // is there a red piece in the way?
        const isJumpRight = gameSettings.ActiveCell.coords.cell - move.coords.cell < 0;
        const jumpedRow = jumpIsUp ? move.coords.row + 1 : move.coords.row - 1;
        const jumpedCell = (isJumpRight) ? gameSettings.ActiveCell.coords.cell + 1 : gameSettings.ActiveCell.coords.cell - 1;
        const jumpedPiece = gameState.rows[jumpedRow][jumpedCell].piece;

        if (jumpedPiece !== "R" && jumpedPiece !== "RK") return { isJump: false };

        return {isJump: true, jumpedPiece: {row: jumpedRow, cell: jumpedCell}};
    }

    function determineIfMoveIsJump(move: Move):MoveIsJumpResponse {
        const startCell = gameSettings.ActiveCell.coords.cell;
        const startRow = gameSettings.ActiveCell.coords.row;

        // are they moving two spaces ahead?
        if (move.coords.row - startRow !== -2) return { isJump: false };
        if (Math.abs(move.coords.cell - startCell) !== 2) return { isJump: false };

        // is there a red piece in the way?
        const isJumpRight = gameSettings.ActiveCell.coords.cell - move.coords.cell < 0;
        const jumpedRow = move.coords.row + 1;
        const jumpedCell = (isJumpRight) ? gameSettings.ActiveCell.coords.cell + 1 : gameSettings.ActiveCell.coords.cell - 1;
        const jumpedPiece = gameState.rows[jumpedRow][jumpedCell].piece;
        if (!jumpedPiece.includes("R")) return { isJump: false };

        return { isJump: true, jumpedPiece: {row: jumpedRow, cell: jumpedCell} };
    }

    function validateDirection(move: Move, isJump: boolean):boolean {
        const startRow = gameState.rows[gameSettings.ActiveCell.coords.row][gameSettings.ActiveCell.coords.cell].row;
        const startCell = gameState.rows[gameSettings.ActiveCell.coords.row][gameSettings.ActiveCell.coords.cell].cell;
        let isValid = false;

        isValid = move.coords.row === startRow - (isJump ? 2 : 1) &&
                            (move.coords.cell === startCell - (isJump ? 2 : 1) ||
                                move.coords.cell === startCell + (isJump ? 2 : 1)
                            );

        if (gameSettings.ActiveCell.piece.includes("K") && !isValid) {
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
        const response:AIResponse = await FetchData({
            endpoint: "Checkers/GetMoveFromAI",
            action: "POST",
            postData: { BoardState: serializedBoard }
        }); 

        if (response.endOfGame) {
            setGameOver(true);
            return;
        }

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
                cell: piece.cell
            };

            jumpedPieces.push(jumpedPiece);
        })

        await performAnimatedMove(newSpace, oldSpace, piece, CHESTER, false, jumpedPieces);
        setPlayerTurn(PLAYER);
        setGameSettings(gs => ({
            ...gs,
            Blocked: false
        }))
    }

    /** Safely returns either undefined or a GameStateCell if the coords are valid */
    function getStateCell(row:number, cell:number):GameStateCell | undefined{
        const selectedRow = gameState.rows[row];
        if (!selectedRow) return undefined;

        const selectedCell = selectedRow[cell];
        
        return (selectedCell) ? selectedCell : undefined;
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
            let jumpedSpace: GameStateCell | undefined;
            let jumpedToSpace: GameStateCell | undefined;

            // check upper left
            jumpedSpace = getStateCell(p.row - 1, p.cell - 1);
            jumpedToSpace = getStateCell(p.row - 2, p.cell - 2)
            if (jumpedSpace && jumpedToSpace && jumpedSpace.piece.includes("R") && jumpedToSpace.piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row - 2, cell: p.cell - 2}})
            }

            // check upper right
            jumpedSpace = getStateCell(p.row - 1, p.cell + 1);
            jumpedToSpace = getStateCell(p.row - 2, p.cell + 2);
            if (jumpedSpace && jumpedToSpace && jumpedSpace.piece.includes("R") && jumpedToSpace.piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row - 2, cell: p.cell + 2}})
            }

            // Guard: not a king, skip remaining checks
            if (!p.piece.includes("K")) return;

            // check lower left
            jumpedSpace = getStateCell(p.row + 1, p.cell - 1);
            jumpedToSpace = getStateCell(p.row + 2, p.cell - 2);
            if (jumpedSpace && jumpedToSpace && jumpedSpace.piece.includes("R") && jumpedToSpace.piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row + 2, cell: p.cell - 2}})
            }

            // check lower right
            jumpedSpace = getStateCell(p.row + 1, p.cell + 1);
            jumpedToSpace = getStateCell(p.row + 2, p.cell + 2);
            if (jumpedSpace && jumpedToSpace && jumpedSpace.piece.includes("R") && jumpedToSpace.piece === "") {
                jumpMoves.push({start: {row: p.row, cell: p.cell}, end: {row: p.row + 2, cell: p.cell + 2}})
            }
        })

        return jumpMoves;
    }

    async function handlePuckClick(move: Move) {
        // Guard clause, prevent multiple player moves
        if (playerTurn === CHESTER) return;

        const isFirstClick = gameSettings.ActiveCell.coords.cell === -1;
        const isKing = gameSettings.ActiveCell.piece.includes("K");
        const pieceAtLocation = gameState.rows[move.coords.row][move.coords.cell].piece;

        if (isFirstClick) {
            if (pieceAtLocation.includes("B")) {
                setGameSettings(gs => ({
                    ...gs,
                    ActiveCell: {coords: move.coords, piece: pieceAtLocation}
                }))
            }
            return;
        }

        // handle 2nd click
        // Reset active cell if user is clicking another black puck
        if (pieceAtLocation.includes("B")) {
            setGameSettings(gs => ({
                ...gs,
                ActiveCell: {coords: {row: move.coords.row, cell: move.coords.cell}, piece: pieceAtLocation}
            }))
            return;
        }

        // If player has a required move, make sure this move matches that move
        if (requiredMove) {
            if (gameSettings.ActiveCell.coords.cell !== requiredMove.start.cell ||
                gameSettings.ActiveCell.coords.row !== requiredMove.start.row ||
                move.coords.row !== requiredMove.end.row ||
                move.coords.cell !== requiredMove.end.cell
            ) {
                // Does not match, reset clicks
                // TODO: again, need error feedback here
                setGameSettings(gs => ({
                    ...gs,
                    ActiveCell: defaultActiveCell
                }))
                return;
            }

            // matches the required move, we can reset state for it
            setRequiredMove(undefined);
        }

        // validate move
        const moveIsJump = isKing ? determineIfMoveIsJumpForKing(move) : determineIfMoveIsJump(move);
        const moveIsValid = validateMove(move, moveIsJump.isJump);

        // Check if player has a jump possible.
        const possibleJumpMoves = findAllJumps();
        if (possibleJumpMoves.length > 0) {
            // jumps are possible, player has to choose one of these available jumps
            const foundMove = possibleJumpMoves.filter(m => m.start.row == gameSettings.ActiveCell.coords.row && 
                m.start.cell == gameSettings.ActiveCell.coords.cell &&
                m.end.row == move.coords.row &&
                m.end.cell == move.coords.cell
            );

            if (foundMove.length == 0) {
                // TODO: this needs to be an error feedback
                setGameSettings(gs => ({
                    ...gs,
                    ActiveCell: defaultActiveCell
                }))
                return;
            }
        }

        const jumpedPieces: Coords[] = [];
        if (moveIsJump.isJump) {
            jumpedPieces.push(moveIsJump.jumpedPiece);
        }

        // TODO: Handle this gracefully, with feedback to the user
        if (!moveIsValid) {
                setGameSettings(gs => ({
                    ...gs,
                    ActiveCell: defaultActiveCell
                }))
                setErrorMessage("Sorry, but that is not a legal move!")
            return;
        }

        // We can safely assume player only plays Black pucks
        let piece = gameSettings.ActiveCell.piece;
        if (move.coords.row === 0 && !piece.includes("K")) {
            piece = piece + "K";
        }

        // Check for additional moves if first move was a jump
        let additionalJumpAvailable = false;

        if (moveIsJump.isJump) {
            // Simulate board state after this jump so we can correctly detect additional jumps
            const simulatedRows: GameStateCell[][] = gameState.rows.map(r => r.map(c => ({...c})));

            const originalStart = gameSettings.ActiveCell.coords;
            // clear the original start position on the simulated board
            if (originalStart.row >= 0 && originalStart.cell >= 0) {
                simulatedRows[originalStart.row][originalStart.cell].piece = "";
            }

            // place moving piece at landing spot
            simulatedRows[move.coords.row][move.coords.cell].piece = piece;

            // remove any jumped pieces from the simulated board
            if (jumpedPieces && jumpedPieces.length > 0) {
                jumpedPieces.forEach(jp => {
                    simulatedRows[jp.row][jp.cell].piece = "";
                })
            }

            const additionalJumpCheckResponse = CheckForAdditionalJumpChance(move.coords, piece, jumpedPieces, simulatedRows);
            additionalJumpAvailable = additionalJumpCheckResponse.Exists;

            // Set required move and keep the active cell if another jump exists
            if (additionalJumpCheckResponse.Exists) {
                setRequiredMove({
                    start: move.coords,
                    end: {
                        row: additionalJumpCheckResponse.PlayerMove?.end.row,
                        cell: additionalJumpCheckResponse.PlayerMove?.end.cell
                    }
                })
            }
        }

        // Update the game state with this move and animate it. If another jump is available, mark moveIsFinished accordingly.
        await performAnimatedMove(move.coords, gameSettings.ActiveCell.coords, piece, PLAYER, !additionalJumpAvailable, jumpedPieces);

        // If additional jumps are available, keep the active cell on the landed piece so the player can continue.
        if (additionalJumpAvailable) {
            setGameSettings(gs => ({
                ...gs,
                ActiveCell: { coords: move.coords, piece }
            }))
        } else {
            setGameSettings(gs => ({
                ...gs,
                ActiveCell: defaultActiveCell
            }))
        }

        if (!additionalJumpAvailable) {
            setPlayerTurn(CHESTER);
        }
    }

    // ----- Local Types ------ //
    type CheckForAdditionalJumpChanceResponse = {
        Exists: boolean,
        PlayerMove: PlayerMove
    }

    // ----- Component Render ----- //
    return (
        <>
            <div className={styles.MainWrap}>
                <div className={styles.GameAreaWrap}>
                    <h1>Checkers with Chester</h1>
                    <h2 className={!gameOver && styles.Hidden} >Game Over!</h2>
                    <GameMenu onQuit={quitGame} onRestart={restart}/>
                    <GameSettingsContext.Provider value={gameSettings}>
                        <div className={styles.BoardWrap}>
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

                            {playerTurn === CHESTER && (
                                <div className={styles.ThinkingOverlay} role="status" aria-live="polite">
                                    {thinkingText}
                                </div>
                            )}
                        </div>
                    </GameSettingsContext.Provider>
                    <div className={`${styles.Error} ${errorMessage != "" ? styles.fadeOut : styles.visible}`}>{errorMessage}</div>
                </div>
            </div>
        </>
    )
}
