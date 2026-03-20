using JayDash.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JayDash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly IAppDbContextFactory _contextFactory;

        public ResumeController(IAppDbContextFactory contextFactory)
        {
            _contextFactory = contextFactory;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkplaceByKey(int workplacePrimaryKey)
        {
            using var context = _contextFactory.CreateContext();

            var workplace = context.Workplaces
                .FirstOrDefault(w => w.PrimaryKey == workplacePrimaryKey);

            return Ok(workplace);
        }
    }
}
