using JayDash.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckersController(ICheckersService _checkersService) : ControllerBase
{
    public async Task<IActionResult> SubmitPlayerMove([FromBody] string boardState, CancellationToken cancellationToken = default)
    {
        var response = _checkersService.SendMoveToAI(boardState, cancellationToken);
        return Ok();
    }
}
