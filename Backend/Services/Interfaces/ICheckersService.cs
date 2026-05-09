using JayDash.Data.Models.Checkers;
using JayDash.Data.Models.Responses;

namespace JayDash.Services.Interfaces;

public interface ICheckersService
{
    /// <summary>
    /// Posts game board state to AI, parses response, returns new Game Board state incorporating AI's move
    /// </summary>
    /// <param name="board"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GetAIMoveResponse> GetMoveFromAI(string boardState, CancellationToken cancellationToken);
}
