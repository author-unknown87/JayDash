using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class EducationRepository(AppDbContext _context) : IEducationRepository
{
    public async Task<List<EducationModel>> GetAllEducation( 
        CancellationToken cancellationToken = default,
        ISpecification<Education>? spec = null)
    {

        var query = _context.Education.AsQueryable();
        if (spec is not null)
        {
            query = query.Where(spec.Criteria);
        }

        var results = await query.Select(e => new EducationModel
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
