using JayDash.Data.Models.Checkers;
using JayDash.Services.Interfaces;

namespace JayDash.Services;

public class CheckersService : ICheckersService
{
    public async Task<GameBoard> SendMoveToAI(string boardState, CancellationToken cancellationToken)
    {
        var gameBoard = new GameBoard(boardState);

        var validMoves = await this.GetValidMoves(gameBoard, cancellationToken);

        var AIResponse = await this.PostGameToAI(gameBoard, validMoves, cancellationToken);

        return gameBoard;
    }

    internal async Task<GameBoard> PostGameToAI(GameBoard board, List<Move> validMoves, CancellationToken cancellationToken)
    {

        return new GameBoard();
    }

    internal async Task<List<Move>> GetValidMoves(GameBoard board, CancellationToken cancellationToken)
    {
        var validMoves = new List<Move>();

        foreach (var row in board.Rows)
        {
            foreach (var cell in row.Cells)
            {
                if (!cell.isPlayable || !cell.HasPuck) continue;

                // validate forward direction
                

                // if king, validate backwards directions too
            }
        }

        return validMoves;
    }
}
