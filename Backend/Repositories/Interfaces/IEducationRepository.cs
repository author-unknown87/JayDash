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

    /// <summary>
    /// Updates existing education record, or creates new one if none found
    /// </summary>
    /// <param name="educationModel"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpsertEducation(EducationModel educationModel, CancellationToken cancellationToken);

    /// <summary>
    /// Deletes targeted education record based on primary key
    /// </summary>
    /// <param name="primaryKey"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task DeleteEducation(int primaryKey, CancellationToken cancellationToken);
}
