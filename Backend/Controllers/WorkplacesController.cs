using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkplacesController(IWorkplaceRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<WorkplaceModel>>> GetAllWorkplaces(CancellationToken cancellationToken = default)
    {
        var workplaces = await repository.GetAllWorkplaces(cancellationToken: cancellationToken);
        return Ok(workplaces);
    }

    [HttpGet("by-name")]
    public async Task<ActionResult<WorkplaceModel>> GetWorkplaceByCompanyName([FromQuery] string companyName, CancellationToken cancellationToken = default)
    {
        // TODO: need to validate data
        var companyNameSpec = new GetWorkplaceByCompanyNameSpec(companyName);
        var workplace = await repository.GetAllWorkplaces(cancellationToken, companyNameSpec);
        return Ok(workplace);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] WorkplaceModel model, CancellationToken cancellationToken = default)
    {
        // Stub: implement create logic using repository when available.
        return CreatedAtAction("test", null, model);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        // Stub: implement delete logic using repository when available.
        return NoContent();
    }
}