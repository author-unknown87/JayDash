using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

namespace JayDash.Repositories.Interfaces;

public interface IIndustryToolsRepository
{
    /// <summary>
    /// Returns all industry tools matching the passed-in specification. If no specification is provided, returns all industry tools.
    /// </summary>
    /// <param name="spec"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<IndustryToolModel>> GetAllIndustryTools(CancellationToken cancellationToken = default, ISpecification<IndustryTool>? spec = null);

    /// <summary>
    /// Insert or update an industry tool record.
    /// </summary>
    Task UpsertTool(IndustryToolModel toolModel, CancellationToken cancellationToken);

    /// <summary>
    /// Delete an industry tool by primary key.
    /// </summary>
    Task DeleteTool(int primaryKey, CancellationToken cancellationToken);
}
