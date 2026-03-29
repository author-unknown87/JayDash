using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class WorkplaceRepository(AppDbContext context) : IWorkplaceRepository
{
    public async Task<List<WorkplaceModel>> GetAllWorkplaces(
        CancellationToken cancellationToken = default,
        ISpecification<Workplace>? spec = null)
    {
        var query = context.Workplaces.AsQueryable();

        if (spec is not null)
        {
            query = query.Where(spec.Criteria);
        }

        var workplaces = await query.Select(w =>
            new WorkplaceModel
            {
                PrimaryKey = w.PrimaryKey,
                CompanyName = w.CompanyName,
                Position = w.Position,
                StartDate = w.StartDate,
                EndDate = w.EndDate,
                CurrentPosition = w.CurrentPosition,
                JobDescription = w.JobDescription
            }).ToListAsync(cancellationToken);

        return workplaces;
    }
}
