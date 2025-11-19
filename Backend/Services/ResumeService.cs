using JayDash.Data;
using System.Runtime.CompilerServices;

namespace JayDash.Services
{
    public class ResumeService
    {
        private readonly AppDbContext dbContext;

        public ResumeService(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task GetResume()
        {

        }
    }
}
