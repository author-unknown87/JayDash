using JayDash.Data;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResumeController(AppDbContext context) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetWorkplaceByKey(int workplacePrimaryKey)
    {
        var workplace = context.Workplaces
            .FirstOrDefault(w => w.PrimaryKey == workplacePrimaryKey);

        return Ok(workplace);
    }
}
