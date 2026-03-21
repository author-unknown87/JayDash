namespace JayDash.Data.Models;

public class EducationModel
{
    public int PrimaryKey { get; set; }

    public string Institution { get; set; }

    public string Description { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string Program { get; set; }
}
