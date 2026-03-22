using JayDash.Data.Models;

namespace JayDash.Repositories.Interfaces;

public interface ISkillsRepository
{
    Task<List<SkillModel>> GetAllSkills(CancellationToken cancellationToken);
}
