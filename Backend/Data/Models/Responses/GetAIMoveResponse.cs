using JayDash.Data.Models.Checkers;

namespace JayDash.Data.Models.Responses;

public class GetAIMoveResponse
{
    public Move? Move { get; set; }
    public string PieceMoved { get; set; }
    public bool EndOfGame { get; set; }

    public bool IsError => this.Move is null;
}
