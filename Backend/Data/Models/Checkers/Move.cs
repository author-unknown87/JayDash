namespace JayDash.Data.Models.Checkers;

public class Move
{
    public List<PuckPosition> Positions { get; set; } = new List<PuckPosition>();
    public List<Coords> JumpedPieces { get; set; } = new List<Coords>();
}

public readonly record struct PuckPosition(int Row, int Col, int PlayOrder);
