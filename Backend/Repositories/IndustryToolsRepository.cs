using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;

namespace JayDash.Repositories;

public class IndustryToolsRepository(AppDbContext context, ILogger<IndustryToolsRepository> _logger) : IIndustryToolsRepository
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

    public async Task UpsertTool(IndustryToolModel toolModel, CancellationToken cancellationToken)
    {
        var result = await context.IndustryTools.FirstOrDefaultAsync(t => t.ToolName == toolModel.ToolName, cancellationToken);
        if (result is null)
        {
            context.IndustryTools.Add(new IndustryTool
            {
                ToolName = toolModel.ToolName
            });

            await context.SaveChangesAsync(cancellationToken);
            return;
        }

        result.ToolName = toolModel.ToolName;

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteTool(int primaryKey, CancellationToken cancellationToken)
    {
        var toolToRemove = await context.IndustryTools.FirstOrDefaultAsync(t => t.PrimaryKey == primaryKey, cancellationToken);
        if (toolToRemove is null)
        {
            _logger.LogInformation("No industry tool found matching primary key {key}", primaryKey);
            return;
        }

        context.IndustryTools.Remove(toolToRemove);
        await context.SaveChangesAsync(cancellationToken);
    }
}
