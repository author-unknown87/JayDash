namespace JayDash.Data.Models;

public class WorkplaceModel
{
    public int PrimaryKey { get; set; }
    public string CompanyName { get; set; }
    public string Position { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string JobDescription { get; set; }
    public bool CurrentPosition { get; set; }
}
