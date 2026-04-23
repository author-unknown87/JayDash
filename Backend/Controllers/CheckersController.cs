using JayDash.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckersController(ICheckersService _checkersService) : ControllerBase
{
    [HttpPost("SubmitPlayerMove")]
    public async Task<IActionResult> SubmitPlayerMove([FromBody] SubmitMoveRequest request, CancellationToken cancellationToken = default)
    {
        var response = _checkersService.SendMoveToAI(request.BoardState, cancellationToken);
        return Ok();
    }
}

public class SubmitMoveRequest
{
    public string BoardState { get; set; }
}