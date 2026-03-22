using JayDash.Data;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class IndustryToolsRepository(AppDbContext context) : IIndustryToolsRepository
{
    public async Task<List<IndustryToolModel>> GetAllIndustryTools(CancellationToken cancellationToken)
    {
        var results = await context.IndustryTools.Select(it => new IndustryToolModel
        {
            PrimaryKey = it.PrimaryKey,
            ToolName = it.ToolName
        }).ToListAsync(cancellationToken);

        return results;
    }
}
