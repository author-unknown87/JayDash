using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkplacesController(IWorkplaceRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<WorkplaceModel>>> Get(CancellationToken cancellationToken = default)
    {
        var workplaces = await repository.GetAllWorkplaces(cancellationToken: cancellationToken);
        return Ok(workplaces);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] WorkplaceModel model, CancellationToken cancellationToken = default)
    {
        // Stub: implement create logic using repository when available.
        return CreatedAtAction(nameof(Get), null, model);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        // Stub: implement delete logic using repository when available.
        return NoContent();
    }
}