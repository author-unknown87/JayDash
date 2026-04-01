using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JayDash.Data.Models.Responses;

namespace JayDash.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController(IEducationRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<EducationModel>>> Get(CancellationToken cancellationToken = default)
    {
        var list = await repository.GetAllEducation(cancellationToken: cancellationToken);
        return Ok(new APIBaseResponse {
            Success = true,
            Message = "",
            Data = list
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EducationModel model, CancellationToken cancellationToken = default)
    {
        await repository.UpsertEducation(model, cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Education upsert complete"));
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        await repository.DeleteEducation(id, cancellationToken);
        return Ok(new APIBaseResponse().OKNoData("Education record deleted"));
    }
}