using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces;

public interface IWorkplaceRepository
{
    Task<List<WorkplaceModel>> GetAllWorkplaces(CancellationToken cancellationToken = default, ISpecification<Workplace>? spec = null);
}
