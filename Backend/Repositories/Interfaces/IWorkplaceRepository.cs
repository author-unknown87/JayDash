using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces;

public interface IWorkplaceRepository
{
    /// <summary>
    /// Returns workplace records matching specification passed in, otherwise all workplaces.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <param name="spec"></param>
    /// <returns></returns>
    Task<List<WorkplaceModel>> GetAllWorkplaces(CancellationToken cancellationToken = default, ISpecification<Workplace>? spec = null);
}
