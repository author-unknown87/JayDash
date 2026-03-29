using JayDash.Data.Models;
using JayDash.Data.Entities;
using JayDash.Repositories.Specifications;
using System.Threading;

namespace JayDash.Repositories.Interfaces;

public interface ISkillsRepository
{
    Task<List<SkillModel>> GetAllSkills(CancellationToken cancellationToken = default, ISpecification<Skill>? spec = null);
}
