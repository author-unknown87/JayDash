using JayDash.Data.Models;
using JayDash.Data.Models.Responses;
using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] SkillModel model, CancellationToken cancellationToken = default)
    {
        await repository.UpsertSkills(model, cancellationToken: cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Skill upserted successfully"));
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        await repository.DeleteSkill(id, cancellationToken: cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Skill Deleted"));
    }
}