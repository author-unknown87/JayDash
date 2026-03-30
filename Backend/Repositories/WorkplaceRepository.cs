using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace JayDash.Repositories;

public class WorkplaceRepository(AppDbContext context, ILogger<WorkplaceRepository> logger) : IWorkplaceRepository
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

    public async Task UpsertWorkplace(WorkplaceModel workplaceModel, CancellationToken cancellationToken)
    {
        var existingWorkplace = await context.Workplaces.FirstOrDefaultAsync(w => w.CompanyName == workplaceModel.CompanyName, cancellationToken);

        if (existingWorkplace is null)
        {
            context.Workplaces.Add(new Workplace
            {
                CompanyName = workplaceModel.CompanyName,
                Position = workplaceModel.Position,
                StartDate = workplaceModel.StartDate,
                EndDate = workplaceModel.EndDate,
                CurrentPosition = workplaceModel.CurrentPosition,
                JobDescription = workplaceModel.JobDescription
            });
        } else
        {
            existingWorkplace.Position = workplaceModel.Position;
            existingWorkplace.StartDate = workplaceModel.StartDate;
            existingWorkplace.EndDate = workplaceModel.EndDate;
            existingWorkplace.CurrentPosition = workplaceModel.CurrentPosition;
            existingWorkplace.JobDescription = workplaceModel.JobDescription;
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteWorkplace(int primaryKey, CancellationToken cancellationToken)
    {
        var workplaceToDelete = await context.Workplaces.FirstOrDefaultAsync(w => w.PrimaryKey == primaryKey, cancellationToken);
        if (workplaceToDelete is null)
        {
            logger.LogError("Failure deleting workplace.  No workplace found matching primary key {primaryKey}", primaryKey);
            return false;
        }

        context.Workplaces.Remove(workplaceToDelete);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
