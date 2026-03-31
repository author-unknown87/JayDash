using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IndustryToolsController(IIndustryToolsRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<IndustryToolModel>>> Get(CancellationToken cancellationToken = default)
    {
        var tools = await repository.GetAllIndustryTools(cancellationToken: cancellationToken);
        return Ok(tools);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] IndustryToolModel model, CancellationToken cancellationToken = default)
    {
        // Stub: implement create logic using repository when available.
        return CreatedAtAction(nameof(Get), null, model);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        // Stub: implement delete logic using repository when available.
        return NoContent();
    }
}