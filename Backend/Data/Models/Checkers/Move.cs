namespace JayDash.Data.Models.Checkers;

public class Move
{
    public PuckPosition StartPosition { get; set; }
    public PuckPosition EndPosition { get; set; }
}

public readonly record struct PuckPosition(int Row, int Col);