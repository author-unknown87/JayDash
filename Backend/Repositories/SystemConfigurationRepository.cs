using JayDash.Data;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SystemConfigurationRepository(AppDbContext appDbContext) : ISystemConfigurationRepository
{
    
    public async Task<SystemConfigurationModel?> GetConfigurationByName(string name, CancellationToken cancellationToken = default)
    {
        var config = await appDbContext.SystemConfigurations.Where(sc => sc.Name == name)
            .Select(sc => new SystemConfigurationModel
            {
                PrimaryKey = sc.PrimaryKey,
                Name = sc.Name,
                Value = sc.Value
            }).FirstOrDefaultAsync(cancellationToken);

        return config;
    }
}
