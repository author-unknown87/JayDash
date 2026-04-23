using JayDash.Data.Models.Checkers.Enums;

namespace JayDash.Data.Models.Checkers;

public class CheckersPuck
{
    public PuckColor Color { get; set; }
    public bool IsKing { get; set; }

    public CheckersPuck(CellModel cellModel)
    {
        this.Color = (cellModel.Piece.Contains("B")) ? PuckColor.Black : PuckColor.Red;
        this.IsKing = cellModel.Piece.Contains("K");
    }
}
