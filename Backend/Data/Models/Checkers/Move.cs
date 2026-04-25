namespace JayDash.Data.Models.Checkers;

public class Move
{
    public List<PuckPosition> Positions { get; set; }
}

public readonly record struct PuckPosition(int Row, int Col, int PlayOrder);