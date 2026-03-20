using JayDash.Data.Models;

namespace JayDash.Repositories.Interfaces
{
    public interface ISystemConfigurationRepository
    {
        /// <summary>
        /// Searches for configuration setting in DB by matching name
        /// </summary>
        /// <param name="name"></param>
        /// <param name="cancellationToken"></param>
        Task<SystemConfigurationModel?> GetConfigurationByName(string name, CancellationToken cancellationToken = default);
    }
}
