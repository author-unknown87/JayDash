using JayDash.Data.Models;
using JayDash.Data.Entities;
using JayDash.Repositories.Specifications;
using System.Threading;

namespace JayDash.Repositories.Interfaces;

public interface ISkillsRepository
{
    /// <summary>
    /// Returns skills matching the passed-in specification, otherwise all skill records
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <param name="spec"></param>
    /// <returns></returns>
    Task<List<SkillModel>> GetAllSkills(CancellationToken cancellationToken = default, ISpecification<Skill>? spec = null);
}
