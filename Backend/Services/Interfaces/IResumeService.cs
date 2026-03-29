using JayDash.Data.Models;

namespace JayDash.Services.Interfaces;

public interface IResumeService
{
    /// <summary>
    /// Gathers and builds all relevant records for the resume page, including skills, education, workplaces, and tools.
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<ResumeModel> GetResume(CancellationToken cancellationToken = default);
}
