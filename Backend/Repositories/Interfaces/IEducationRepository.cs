using JayDash.Data.Models;

namespace JayDash.Repositories.Interfaces;

public interface IEducationRepository
{
    Task<List<EducationModel>> GetAllEducation(CancellationToken cancellationToken);
}
