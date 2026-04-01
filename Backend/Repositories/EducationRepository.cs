using JayDash.Data;
using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Repositories.Specifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace JayDash.Repositories;

public class EducationRepository(AppDbContext _context, ILogger<EducationRepository> _logger) : IEducationRepository
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

    public async Task UpsertEducation(
        EducationModel educationModel,
        CancellationToken cancellationToken)
    {
        var targetEducation = await _context.Education.FirstOrDefaultAsync(e => e.Institution == educationModel.Institution, cancellationToken);
        if (targetEducation is not null)
        {
            targetEducation.Institution = educationModel.Institution;
            targetEducation.Description = educationModel.Description;
            targetEducation.StartDate = educationModel.StartDate;
            targetEducation.EndDate = educationModel.EndDate;
            targetEducation.Program = educationModel.Program;
            targetEducation.GPA = educationModel.GPA;

            _context.Update(targetEducation);
            await _context.SaveChangesAsync(cancellationToken);

            return;
        }

        _context.Education.Add(new Education
        {
            Institution = educationModel.Institution,
            Description = educationModel.Description,
            StartDate = educationModel.StartDate,
            EndDate = educationModel.EndDate,
            Program = educationModel.Program,
            GPA = educationModel.GPA
        });

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteEducation(int primaryKey, CancellationToken cancellationToken)
    {
        var educationToRemove = await _context.Education.FirstOrDefaultAsync(e => e.PrimaryKey == primaryKey, cancellationToken);
        if (educationToRemove is null)
        {
            _logger.LogInformation("No education record found mathcing primary key {key}", primaryKey);
            return;
        }

        _context.Education.Remove(educationToRemove);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
