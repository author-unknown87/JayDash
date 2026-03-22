using JayDash.Data;
using JayDash.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResumeController(AppDbContext _context, IResumeService _resumeService) : ControllerBase
{
    public async Task<IActionResult> GetResume(CancellationToken cancellationToken = default)
    {
        var resume = _resumeService.GetResume(cancellationToken);
        return Ok(resume);
    }
}
