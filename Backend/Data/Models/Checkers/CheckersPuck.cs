using JayDash.Data.Models.Checkers.Enums;

namespace JayDash.Data.Models.Checkers;

public class CheckersPuck
{
    public PuckColor Color { get; set; }
    public bool IsKing { get; set; }
    public int Row { get; set; }
    public int Cell { get; set; }
}
