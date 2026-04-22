namespace JayDash.Data.Models.Checkers;

public class Move
{
    public CheckersPuck StartPuck { get; set; }

    public CheckersPuck EndPuck { get; set; }

    public bool IsValid { get; set; }
}
