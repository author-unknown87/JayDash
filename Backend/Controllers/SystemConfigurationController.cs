using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SystemConfigurationController(ISystemConfigurationRepository systemConfigurationRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetSystemConfigByName(string configName, CancellationToken cancellationToken = default)
    {
        var config = await systemConfigurationRepository.GetConfigurationByName(configName, cancellationToken);
        return Ok(config);
    }
}
