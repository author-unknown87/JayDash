import { 
    GameState, 
    GameStateCell, 
    Coords
 } from '../../../../models/CheckersTypes'

/** Validates space jumped to is empty and player is jumping over an enemy piece */
export function validateJump(
    targetRow:GameStateCell[], 
    jumpedRow:GameStateCell[], 
    jumpedPieces: Coords[],
    startSpace:Coords, 
    isLeft:Boolean
):boolean {
    const cellSign = isLeft ? -1 : 1;

    const cell = targetRow[startSpace.cell + (2 * cellSign)];
    const jumpedSpace = jumpedRow[startSpace.cell + (1 * cellSign)];
    const jumpedAlready = jumpedSpace ? jumpedPieces.find(jp => jp.row === jumpedSpace.row && jp.cell === jumpedSpace.cell) : undefined;

    if (cell && cell.piece === "" && !jumpedAlready && jumpedSpace.piece.includes("R")) return true;

    return false;
}

/** Checks for possibility of another jump move for the player */
export function CheckForAdditionalJumpChance(
    startSpace:Coords, 
    piece:string, 
    jumpedPieces: Coords[],
    gameState: GameState
):boolean {
    const isKing = piece.includes("K");
    const forwardRow = gameState.rows[startSpace.row - 2];
    const jumpedForwardRow = gameState.rows[startSpace.row - 1];

    if (!forwardRow && !isKing) return false;

    if (forwardRow) {
        // Check forward jump left
        var leftForwardIsValid = validateJump(forwardRow, jumpedForwardRow, jumpedPieces, startSpace, true);
        if (leftForwardIsValid) return true;

        // Check forward jump right
        var rightForwardIsValid = validateJump(forwardRow, jumpedForwardRow, jumpedPieces, startSpace, false);
        if (rightForwardIsValid) return true;
    }

    if (!isKing) return false;

    const backwardsRow = gameState.rows[startSpace.row + 2];
    const jumpedBackwardsRow = gameState.rows[startSpace.row + 1];
    if (!backwardsRow) return false;

    // IF KING check backward jump left
    var leftBackIsValid = validateJump(backwardsRow, jumpedBackwardsRow, jumpedPieces, startSpace, true);
    if (leftBackIsValid) return true;

    // IF KING check backward jump right
    var rightBackIsValid = validateJump(backwardsRow, jumpedBackwardsRow, jumpedPieces, startSpace, false);
    if (rightBackIsValid) return true;

    return false;
}

/** Determines if player has any jump moves available */
export function checkIfPlayerHasJumpMoveAvailable(
    gameState: GameState
):boolean {
    

    return false;
}