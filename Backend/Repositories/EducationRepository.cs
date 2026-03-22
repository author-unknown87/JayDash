using JayDash.Data;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class EducationRepository(AppDbContext context) : IEducationRepository
{
    public async Task<List<EducationModel>> GetAllEducation(CancellationToken cancellationToken)
    {
        var results = await context.Education.Select(e => new EducationModel
        {
            PrimaryKey = e.PrimaryKey,
            Institution = e.Institution,
            Description = e.Description,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Program = e.Program,
            GPA = e.GPA
        }).ToListAsync(cancellationToken);

        return results;
    }
}
