using JayDash.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckersController(ICheckersService _checkersService) : ControllerBase
{
    [HttpPost("GetMoveFromAI")]
    public async Task<IActionResult> GetMoveFromAI([FromBody] SubmitMoveRequest request, CancellationToken cancellationToken = default)
    {
        var response = await _checkersService.GetMoveFromAI(request.BoardState, cancellationToken);
        // five second pause to simulate AI processing
        Thread.Sleep(2 * 1000);
        return (response != null) ? Ok(response) : Ok("System Error");
    }
}

public class SubmitMoveRequest
{
    public string BoardState { get; set; }
}