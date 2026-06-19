import { GameState, GameStateCell, Coords, ActiveCellContext, Move, ActiveCell } from '../../../models/CheckersTypes'

export function createFreshGameState(): GameState {
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

export function createTestGameState(): GameState {
    const board = createFreshGameState();

    //make adjustments
    for (let row = 0; row <= 7; row++) {
        for (let col = 0; col <= 7; col++) {
            board.rows[row][col].piece = ""
        }
    }

    board.rows[2][2].piece = "";
    board.rows[4][2].piece = "R";


    return board;
}

export function CheckIfPlayerHasMoves(
    gameState: GameState
): boolean {
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