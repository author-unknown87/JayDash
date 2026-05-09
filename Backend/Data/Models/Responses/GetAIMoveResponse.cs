using JayDash.Data.Models.Checkers;
using System.Reflection.Metadata.Ecma335;

namespace JayDash.Data.Models.Responses;

public class GetAIMoveResponse
{
    public Move? Move { get; set; }
    public string PieceMoved { get; set; }
    public bool IsError => this.Move is null;
}
