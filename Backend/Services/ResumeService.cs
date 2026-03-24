using JayDash.Data.Models;
using JayDash.Repositories.Interfaces;
using JayDash.Services.Interfaces;

namespace JayDash.Services;

public class ResumeService(
    IWorkplaceRepository _workplaceRepository,
    IEducationRepository _educationRepository,
    IIndustryToolsRepository _industryToolsRepository,
    ISkillsRepository _skillsRepository) : IResumeService
{
    public async Task<ResumeModel> GetResume(CancellationToken cancellationToken = default)
    {
        var resume = new ResumeModel();

        // Get Workplaces
        resume.Workplaces = await this.GetWorkplaces(cancellationToken);

        // Get Skills
        resume.Skills = await this.GetSkillsets(cancellationToken);

        // Get Education
        resume.Education = await this.GetEducationRecords(cancellationToken);   
        
        // Get Industry Tools
        resume.IndustryTools = await this.GetIndustryTools(cancellationToken);

        // return
        return resume;
    }

    private async Task<List<WorkplaceModel>> GetWorkplaces(CancellationToken cancellationToken)
    {
        var workplaces = await _workplaceRepository.GetAllWorkplaces(cancellationToken);
        workplaces = workplaces.OrderByDescending(w => w.StartDate).ToList();
        return workplaces;
    }

    private async Task<List<EducationModel>> GetEducationRecords(CancellationToken cancellationToken)
    {
        var educationRecords = await _educationRepository.GetAllEducation(cancellationToken);
        return educationRecords;
    }

    private async Task<List<SkillModel>> GetSkillsets(CancellationToken cancellationToken)
    {
        var skillset = await _skillsRepository.GetAllSkills(cancellationToken);
        return skillset;
    }

    private async Task<List<IndustryToolModel>> GetIndustryTools(CancellationToken cancellationToken)
    {
        var tools = await _industryToolsRepository.GetAllIndustryTools(cancellationToken);
        return tools;
    }
}
