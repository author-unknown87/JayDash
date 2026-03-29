using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class IndustryToolsRepository(AppDbContext context) : IIndustryToolsRepository
{
    public async Task<List<IndustryToolModel>> GetAllIndustryTools(
        CancellationToken cancellationToken = default,
        ISpecification<IndustryTool>? spec = null)
    {
        var query = context.IndustryTools.AsQueryable();

        if (spec is not null)
        {
            query = query.Where(spec.Criteria);
        }

        var results = await query.Select(it => new IndustryToolModel
        {
            PrimaryKey = it.PrimaryKey,
            ToolName = it.ToolName
        }).ToListAsync(cancellationToken);

        return results;
    }
}
