using System.ComponentModel.DataAnnotations;

namespace API.Authentication.Models;

public class ChangeRoleRequest
{
    [Required(ErrorMessage = "New role is required")]
    [RegularExpression("User|Moderator|Admin", ErrorMessage = "Invalid role")]
    public string NewRole { get; set; } = string.Empty;
}