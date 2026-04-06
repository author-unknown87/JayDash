using JayDash.Data.Entities;
using JayDash.Data.Models;
using JayDash.Repositories.Specifications;

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

    /// <summary>
    /// Updates existing skill, or creates new one if none found matching skill name
    /// </summary>
    /// <param name="skill"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task UpsertSkills(SkillModel skill, CancellationToken cancellationToken);

    /// <summary>
    /// Deletes skill matching primary key, if found
    /// </summary>
    /// <param name="primaryKey"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task DeleteSkill(int primaryKey, CancellationToken cancellationToken);
}
