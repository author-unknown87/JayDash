namespace JayDash.Data.Interfaces
{
    public interface IAppDbContextFactory
    {
        public AppDbContext CreateContext();
    }
}
