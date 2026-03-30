using JayDash.Data.Models;
using JayDash.Data.Models.Responses;
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
        var baseResponse = new APIBaseResponse()
        {
            Success = true,
            Message = "",
            Data = workplace
        };
        return Ok(baseResponse);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] WorkplaceModel model, CancellationToken cancellationToken = default)
    {
        await repository.UpsertWorkplace(model, cancellationToken);
        var response = new APIBaseResponse()
        {
            Success = true,
            Message = "Upsert for workplace complete"
        };
        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromQuery] int id, CancellationToken cancellationToken = default)
    {
        var workplaceDeleted = await repository.DeleteWorkplace(primaryKey: id, cancellationToken);
        var msg = workplaceDeleted ? "Workplace entry deleted" : "Failed to delete workplace entry";
        var response = new APIBaseResponse()
        {
            Success = workplaceDeleted,
            Message = msg
        };

        return Ok(response);
    }
}