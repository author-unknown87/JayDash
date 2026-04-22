using JayDash.Data.Models.Checkers;

namespace JayDash.Services.Interfaces;

public interface ICheckersService
{
    /// <summary>
    /// Posts game board state to AI, parses response, returns new Game Board state incorporating AI's move
    /// </summary>
    /// <param name="board"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GameBoard> SendMoveToAI(string boardState, CancellationToken cancellationToken);
}
