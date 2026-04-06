namespace JayDash.Data.Models.Responses;

public class APIBaseResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public object? Data { get; set; }

    public APIBaseResponse OKNoData(string message)
    {
        this.Success = true;
        this.Message = message;
        return this;
    }
}
