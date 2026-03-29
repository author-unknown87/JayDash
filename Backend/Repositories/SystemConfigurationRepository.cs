using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SystemConfigurationRepository(AppDbContext appDbContext) : ISystemConfigurationRepository
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
}
