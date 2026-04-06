using System.ComponentModel.DataAnnotations;

namespace JayDash.Data.Models.Requests;

public class UpdateSystemConfigValueRequest
{
    [Required]
    public string ConfigName { get; set; }

    [Required]
    public string Value { get; set; }
}
