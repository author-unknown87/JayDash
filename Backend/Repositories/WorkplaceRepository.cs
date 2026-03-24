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
                PrimaryKey = w.PrimaryKey,
                CompanyName = w.CompanyName,
                Position = w.Position,
                StartDate = w.StartDate,
                EndDate = w.EndDate,
                CurrentPosition = w.CurrentPosition,
                JobDescription = w.JobDescription
            }).ToListAsync(cancellationtoken);

        return workplaces;
    }
}
