using JayDash.Data;
using JayDash.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResumeController(
    AppDbContext _context, 
    IResumeService _resumeService,
    ILogger<ResumeController> _logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetResume(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Resume controller called.  Endpoint: GetResume");
        var resume = await _resumeService.GetResume(cancellationToken);
        return Ok(resume);
    }
}
