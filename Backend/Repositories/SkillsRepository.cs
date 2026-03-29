using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SkillsRepository(AppDbContext context) : ISkillsRepository
{
    public async Task<List<SkillModel>> GetAllSkills(
        CancellationToken cancellationToken = default,
        ISpecification<Skill>? spec = null)
    {
        var query = context.Skills.AsQueryable();

        if (spec is not null)
        {
            query = query.Where(spec.Criteria);
        }

        var results = await query.Select(s => new SkillModel
        {
            PrimaryKey = s.PrimaryKey,
            SkillName = s.SkillName,
            StartDate = s.StartDate
        }).ToListAsync(cancellationToken);

        return results;
    }
}
