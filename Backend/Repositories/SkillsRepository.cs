using JayDash.Data;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class SkillsRepository(AppDbContext context) : ISkillsRepository
{
    public async Task<List<SkillModel>> GetAllSkills(CancellationToken cancellationToken)
    {
        var results = await context.Skills.Select(s => new SkillModel
        {
            PrimaryKey = s.PrimaryKey,
            SkillName = s.SkillName,
            StartDate = s.StartDate
        }).ToListAsync(cancellationToken);

        return results;
    }
}
