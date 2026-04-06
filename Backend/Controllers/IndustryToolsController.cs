using JayDash.Data.Models;
using JayDash.Data.Models.Responses;
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
    public async Task<IActionResult> UpsertTool([FromBody] IndustryToolModel model, CancellationToken cancellationToken = default)
    {
        await repository.UpsertTool(model, cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Industry tool upsert complete"));
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTool(int id, CancellationToken cancellationToken = default)
    {
        await repository.DeleteTool(id, cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Industry tool deleted"));
    }
}