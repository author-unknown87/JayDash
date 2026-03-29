using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces;

public interface ISystemConfigurationRepository
{
    /// <summary>
    /// Returns configurations matching passed-in specification, otherwise all configuration records.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="spec"></param>
    /// <param name="cancellationToken"></param>
    Task<SystemConfigurationModel?> GetConfigurations(ISpecification<SystemConfiguration>? spec = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates specific named configuration with the new value
    /// </summary>
    /// <param name="configName"></param>
    /// <param name="newValue"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<(bool Success, string Message)> UpdateConfiguration(string configName, string newValue, CancellationToken cancellationToken);
}
