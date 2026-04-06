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

    public async Task UpsertSkills(SkillModel skill, CancellationToken cancellationToken)
    {
        var result = await context.Skills.FirstOrDefaultAsync(s => s.SkillName == skill.SkillName, cancellationToken);
        if (result is null)
        {
            context.Skills.Add(new Skill
            {
                SkillName = skill.SkillName,
                StartDate = skill.StartDate
            });

            await context.SaveChangesAsync(cancellationToken);
            return;
        }

        result.SkillName = skill.SkillName;
        result.StartDate = skill.StartDate;

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteSkill(int primaryKey, CancellationToken cancellationToken)
    {
        var result = await context.Skills.FirstOrDefaultAsync(s => s.PrimaryKey == primaryKey, cancellationToken);

        if (result is null) return;

        context.Skills.Remove(result);
        await context.SaveChangesAsync(cancellationToken);
    }
}
