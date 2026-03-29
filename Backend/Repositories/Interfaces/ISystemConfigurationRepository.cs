using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces
{
    public interface ISystemConfigurationRepository
    {
        /// <summary>
        /// Searches for configuration setting in DB by matching name. Optional specification may further filter results.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="spec"></param>
        /// <param name="cancellationToken"></param>
        Task<SystemConfigurationModel?> GetConfigurations(ISpecification<SystemConfiguration>? spec = null, CancellationToken cancellationToken = default);
    }
}
