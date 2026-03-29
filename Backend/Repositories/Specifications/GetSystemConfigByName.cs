using JayDash.Data.Entities;
using System.Linq.Expressions;

namespace JayDash.Repositories.Specifications;

public class GetSystemConfigByName : ISpecification<SystemConfiguration>
{
    public string ConfigName { get; }
    public Expression<Func<SystemConfiguration, bool>> Criteria => sc => sc.Name == ConfigName;

    public GetSystemConfigByName(string configName)
    {
        ConfigName = configName;
    }
}
