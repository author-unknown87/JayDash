using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SystemConfigurationController(ISystemConfigurationRepository systemConfigurationRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetSystemConfigByName(string configName, CancellationToken cancellationToken = default)
    {
        var nameSpecification = new GetSystemConfigByName(configName);
        var config = await systemConfigurationRepository.GetConfigurations(nameSpecification, cancellationToken);
        return Ok(config);
    }
}
