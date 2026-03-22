using JayDash.Data.Models;

namespace JayDash.Repositories.Interfaces;

public interface IIndustryToolsRepository
{
    Task<List<IndustryToolModel>> GetAllIndustryTools(CancellationToken cancellationToken);
}
