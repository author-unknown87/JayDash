using JayDash.Data.Interfaces;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SystemConfigurationRepository : ISystemConfigurationRepository
{
    private IAppDbContextFactory _contextFactory { get; set; }

    public SystemConfigurationRepository(IAppDbContextFactory dbContextFactory)
    {
        _contextFactory = dbContextFactory;
    }
    
    public async Task<SystemConfigurationModel?> GetConfigurationByName(string name, CancellationToken cancellationToken = default)
    {
        var context = _contextFactory.CreateContext();

        var config = await context.SystemConfigurations.Where(sc => sc.Name == name)
            .Select(sc => new SystemConfigurationModel
            {
                PrimaryKey = sc.PrimaryKey,
                Name = sc.Name,
                Value = sc.Value
            }).FirstOrDefaultAsync(cancellationToken);

        return config;
    }
}
