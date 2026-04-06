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

    /// <summary>
    /// Upserts passed in workplace model
    /// </summary>
    /// <param name="workplaceModel"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpsertWorkplace(WorkplaceModel workplaceModel, CancellationToken cancellationToken);

    /// <summary>
    /// Deletes workplace from table, if entity is found
    /// </summary>
    /// <param name="primaryKey"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DeleteWorkplace(int primaryKey, CancellationToken cancellationToken);
}
