namespace API.Users.Models;

public static class UserMapper
{
    public static AppUserDto CastToDto(this AppUser instance)
    {
        return new AppUserDto
        {
            Id = instance.Id,
            UserName = instance.UserName ?? string.Empty,
            Email = instance.Email ?? string.Empty,
        };
    }

    public static void UpdateUser(this AppUser instance, AppUserDto request)
    {
        instance.Email = request.Email ?? instance.Email;
        instance.UserName = request.UserName ?? instance.UserName;
    }
}