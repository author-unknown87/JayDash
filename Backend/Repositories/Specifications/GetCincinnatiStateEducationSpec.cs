using JayDash.Data.Entities;
using System.Linq.Expressions;

namespace JayDash.Repositories.Specifications;

/// <summary>
/// Education specification
/// </summary>
public class GetCincinnatiStateEducationSpec : ISpecification<Education>
{
    public Expression<Func<Education, bool>> Criteria { get; }

    public GetCincinnatiStateEducationSpec()
    {
        this.Criteria = ed => ed.Institution == "Cincinnati State Technical College";
    }
}
