using JayDash.Data.Models.Requests;
using JayDash.Data.Models.Responses;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> UpdateSystemConfigValue([FromBody] UpdateSystemConfigValueRequest request, CancellationToken cancellationToken = default)
    {
        var result = await systemConfigurationRepository.UpdateConfiguration(request.ConfigName, request.Value, cancellationToken);
        var response = new APIBaseResponse()
        {
            Message = result.Message,
            Success = result.Success
        };
        return Ok(response);
    }
}
