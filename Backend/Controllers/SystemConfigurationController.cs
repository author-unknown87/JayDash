using JayDash.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemConfigurationController: ControllerBase
    {
        private readonly ISystemConfigurationRepository _systemConfigurationRepository;

        public SystemConfigurationController(ISystemConfigurationRepository systemConfigurationRepository)
        {
            _systemConfigurationRepository = systemConfigurationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemConfigByName(string configName, CancellationToken cancellationToken = default)
        {
            var config = await _systemConfigurationRepository.GetConfigurationByName(configName, cancellationToken);
            return Ok(config);
        }
    }
}
