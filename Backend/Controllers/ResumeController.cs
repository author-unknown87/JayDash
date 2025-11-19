using JayDash.Data;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public ResumeController(AppDbContext context)
        {
            this.dbContext = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkplaceByKey(int workplacePrimaryKey)
        {
            var workplace = this.dbContext.Workplaces
                .FirstOrDefault(w => w.PrimaryKey == workplacePrimaryKey);

            return Ok(workplace);
        }
    }
}
