using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController(ISkillsRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<SkillModel>>> Get(CancellationToken cancellationToken = default)
    {
        var skills = await repository.GetAllSkills(cancellationToken: cancellationToken);
        return Ok(skills);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] SkillModel model, CancellationToken cancellationToken = default)
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