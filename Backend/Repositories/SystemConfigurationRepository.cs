using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SystemConfigurationRepository(
    AppDbContext appDbContext,
    ILogger<SystemConfigurationRepository> logger) : ISystemConfigurationRepository
{
    public async Task<SystemConfigurationModel?> GetConfigurations(
        ISpecification<SystemConfiguration>? spec = null,
        CancellationToken cancellationToken = default)
    {
        var query = appDbContext.SystemConfigurations.AsQueryable();

        if (spec is not null)
        {
            query = query.Where(spec.Criteria);
        }

        var config = await query.Select(sc => new SystemConfigurationModel
            {
                PrimaryKey = sc.PrimaryKey,
                Name = sc.Name,
                Value = sc.Value
            }).FirstOrDefaultAsync(cancellationToken);

        return config;
    }

    public async Task<(bool Success, string Message)> UpdateConfiguration(string configName, string newValue, CancellationToken cancellationToken)
    {
        var config = await appDbContext.SystemConfigurations.Where(sc => sc.Name == configName).FirstOrDefaultAsync(cancellationToken);

        if (config is null)
        {
            logger.LogError("Failed to find matching system configuration during update call.  Target Config Name: {configName}, intended value: {value}", configName, newValue);
            return (Success: false, Message: $"Did not find matching system configuration with name {configName}");
        }

        config.Value = newValue;
        await appDbContext.SaveChangesAsync(cancellationToken);
        return (Success: true, Message: "");
    }
}
