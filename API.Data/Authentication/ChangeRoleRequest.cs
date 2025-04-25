using System.ComponentModel.DataAnnotations;

namespace Data.Authentication;

public class ChangeRoleRequest
{
    [Required(ErrorMessage = "New role is required")]
    [RegularExpression("User|Moderator|Admin", ErrorMessage = "Invalid role")]
    public string NewRole { get; set; } = string.Empty;
}