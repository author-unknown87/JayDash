using JayDash.Data.Models;

namespace JayDash.Repositories.Interfaces;

public interface IWorkplaceRepository
{
    Task<List<WorkplaceModel>> GetAllWorkplaces(CancellationToken cancellationtoken = default);
}
