using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces;

public interface IEducationRepository
{
    /// <summary>
    /// Returns all education records matching the specification passed in.  Otherwise, all education records.
    /// </summary>
    /// <param name="whereClause"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<EducationModel>> GetAllEducation(CancellationToken cancellationToken = default, ISpecification<Education>? spec = null);
}
