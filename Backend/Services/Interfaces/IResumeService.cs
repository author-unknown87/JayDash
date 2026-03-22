using JayDash.Data.Models;

namespace JayDash.Services.Interfaces;

public interface IResumeService
{
    Task<ResumeModel> GetResume(CancellationToken cancellationToken = default);
}
