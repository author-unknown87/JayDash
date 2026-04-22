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
        return new List<Move>();
    }
}
