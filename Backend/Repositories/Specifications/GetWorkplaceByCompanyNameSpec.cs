using JayDash.Data.Entities;
using System.Linq.Expressions;

namespace JayDash.Repositories.Specifications;

public class GetWorkplaceByCompanyNameSpec : ISpecification<Workplace>
{
    public string CompanyName { get; set; }
    public Expression<Func<Workplace, bool>> Criteria => w => w.CompanyName == this.CompanyName;

    public GetWorkplaceByCompanyNameSpec(string companyName)
    {
        CompanyName = companyName;
    }
}
