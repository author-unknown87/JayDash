using JayDash.Data;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class WorkplaceRepository(AppDbContext context) : IWorkplaceRepository
{
    public async Task<List<WorkplaceModel>> GetAllWorkplaces(CancellationToken cancellationtoken = default)
    {
        var workplaces = await context.Workplaces.Select(w =>
            new WorkplaceModel
            {
                PrimaryKey = w.PrimaryKey
            }).ToListAsync(cancellationtoken);

        return workplaces;
    }
}
