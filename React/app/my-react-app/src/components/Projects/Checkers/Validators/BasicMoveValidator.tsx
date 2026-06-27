import { GameState, GameStateCell, Coords, ActiveCellContext, Move, ActiveCell } from '../../../../models/CheckersTypes'

/** verifies move is to an empty space and within movement restrictions */
export function validateMove(
    move: Move, 
    isJump: boolean, 
    gameState: GameState,
    activeCell: ActiveCell
): boolean {
    const spaceIsEmpty = targetSpaceIsEmpty(move, gameState);
    const spaceIsWithinMovementRules = targetSpaceWithinMovementRules(move, isJump, gameState, activeCell);
    return (spaceIsEmpty && spaceIsWithinMovementRules);
}

/** Determines if target space being moved to is empty */
export function targetSpaceIsEmpty(
    move: Move, 
    gameState: GameState
):boolean {
    const pieceAtCell = gameState.rows[move.coords.row][move.coords.cell].piece;
    return pieceAtCell === "";
}

/** Validates player is choosing either a single space away, or if it's a jump
 * that the space being moved to is only two rows away
 */
export function targetSpaceWithinMovementRules(
    move: Move, 
    isJump: boolean, 
    gameState: GameState,
    activeCell: ActiveCell
):boolean {
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