using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces
{
    public interface ISystemConfigurationRepository
    {
        /// <summary>
        /// Returns configurations matching passed-in specification, otherwise all configuration records.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="spec"></param>
        /// <param name="cancellationToken"></param>
        Task<SystemConfigurationModel?> GetConfigurations(ISpecification<SystemConfiguration>? spec = null, CancellationToken cancellationToken = default);
    }
}
