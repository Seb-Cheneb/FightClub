using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Data.Authentication;
using Data.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthenticationController> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthenticationController(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration,
        ILogger<AuthenticationController> logger)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        _logger.LogInformation("Login called");

        var user = await _userManager.FindByNameAsync(model.Username);

        if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var token = await GenerateJwtWithRolesAsync(user, roles);

        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(60);

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Login succeeded");

        return Ok(new AuthenticationResponse
        {
            JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpirationDate = token.ValidTo,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Role = roles.FirstOrDefault() ?? "User"
        });
    }

    [HttpPost("Refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest model)
    {
        _logger.LogInformation("Refresh called");

        var principal = GetPrincipalFromExpiredToken(model.AccessToken);

        if (principal?.Identity?.Name is null) return Unauthorized();

        var user = await _userManager.FindByNameAsync(principal.Identity.Name);

        if (user is null ||
            user.RefreshToken != model.RefreshToken ||
            user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        // Get user roles for the new token
        var roles = await _userManager.GetRolesAsync(user);
        var token = await GenerateJwtWithRolesAsync(user, roles);

        _logger.LogInformation("Refresh succeeded");

        return Ok(new AuthenticationResponse
        {
            JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpirationDate = token.ValidTo,
            RefreshToken = model.RefreshToken,
            UserId = user.Id,
            Role = roles.FirstOrDefault() ?? "User"
        });
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegistrationRequest model)
    {
        _logger.LogInformation("Register called");

        // Check if the username already exists
        var existingUser = await _userManager.FindByNameAsync(model.Username);
        if (existingUser != null)
        {
            _logger.LogWarning("User with username {Username} already exists", model.Username);
            return Conflict("User already exists.");
        }

        // Add a new user object
        var newUser = new AppUser
        {
            UserName = model.Username,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString() // SecurityStamp to prevent replay attacks
        };

        // Attempt to create the user with the provided password
        var createResult = await _userManager.CreateAsync(newUser, model.Password);
        if (!createResult.Succeeded)
        {
            // Log the errors and return a meaningful message
            _logger.LogWarning("User creation failed for {Username}: {Errors}", model.Username, string.Join(", ", createResult.Errors.Select(e => e.Description)));
            return StatusCode(StatusCodes.Status500InternalServerError, $"Failed to create user: {string.Join(" ", createResult.Errors.Select(e => e.Description))}");
        }

        // --- ROLE ASSIGNMENT CHANGES START HERE ---
        const string defaultRole = "User";
        var normalizedRole = _roleManager.NormalizeKey(defaultRole);

        // Check if role exists using normalized name
        if (!await _roleManager.RoleExistsAsync(normalizedRole))
        {
            var createRoleResult = await _roleManager.CreateAsync(new IdentityRole(defaultRole));
            if (!createRoleResult.Succeeded)
            {
                _logger.LogError("Role creation failed: {Errors}", string.Join(", ", createRoleResult.Errors));
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create role");
            }
        }

        var roleResult = await _userManager.AddToRoleAsync(newUser, normalizedRole);
        if (!roleResult.Succeeded)
        {
            _logger.LogWarning("Role assignment failed: {Errors}", string.Join(", ", roleResult.Errors));
        }

        // Get roles for token generation
        var roles = new List<string> { defaultRole }; // Force "User" role
        var token = await GenerateJwtWithRolesAsync(newUser, roles);

        var refreshToken = GenerateRefreshToken();
        newUser.RefreshToken = refreshToken;
        newUser.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(60);

        await _userManager.UpdateAsync(newUser);

        _logger.LogInformation("User {Username} registered successfully with role {Role}.", model.Username, defaultRole);

        return Ok(new AuthenticationResponse
        {
            JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpirationDate = token.ValidTo,
            RefreshToken = refreshToken,
            UserId = newUser.Id,
            Role = defaultRole
        });
    }

    [Authorize]
    [HttpDelete("Revoke")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Revoke()
    {
        _logger.LogInformation("Revoke called");

        var username = HttpContext.User.Identity?.Name;
        if (username is null) return Unauthorized();

        var user = await _userManager.FindByNameAsync(username);
        if (user is null) return Unauthorized();

        user.RefreshToken = string.Empty;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Revoke succeeded");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("ChangeRole/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ChangeUserRole(string userId, [FromBody] ChangeRoleRequest request)
    {
        _logger.LogInformation("ChangeUserRole called for user {UserId} to role {NewRole}", userId, request.NewRole);

        // Validate request
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validate role input
        var validRoles = new[] { "User", "Moderator", "Admin" };
        if (!validRoles.Contains(request.NewRole, StringComparer.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Invalid role {Role} specified", request.NewRole);
            return BadRequest($"Invalid role. Allowed values: {string.Join(", ", validRoles)}");
        }

        // Find user
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found", userId);
            return NotFound("User not found");
        }

        // Normalize and verify role exists
        var normalizedRole = _roleManager.NormalizeKey(request.NewRole);
        if (!await _roleManager.RoleExistsAsync(normalizedRole))
        {
            _logger.LogWarning("Role {Role} does not exist in system", request.NewRole);
            return BadRequest("Specified role does not exist");
        }

        try
        {
            // Remove existing roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    _logger.LogError("Failed to remove existing roles: {Errors}",
                        string.Join(", ", removeResult.Errors));
                    return StatusCode(500, "Failed to remove existing roles");
                }
            }

            // Add new role
            var addResult = await _userManager.AddToRoleAsync(user, normalizedRole);
            if (!addResult.Succeeded)
            {
                _logger.LogError("Failed to add new role: {Errors}",
                    string.Join(", ", addResult.Errors));
                return StatusCode(500, "Failed to assign new role");
            }

            _logger.LogInformation("Successfully changed role for user {UserId} to {NewRole}",
                userId, normalizedRole);

            return Ok(new
            {
                Message = "Role changed successfully",
                UserId = userId,
                NewRole = normalizedRole
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing role for user {UserId}", userId);
            return StatusCode(500, "An error occurred while changing roles");
        }
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var generator = RandomNumberGenerator.Create();
        generator.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async Task<JwtSecurityToken> GenerateJwtWithRolesAsync(AppUser user, IList<string> roles)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id)
        };

        // Add all roles as claims
        foreach (var role in roles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured")));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.UtcNow.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
    {
        var secret = _configuration["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured");

        var validation = new TokenValidationParameters
        {
            ValidIssuer = _configuration["JWT:ValidIssuer"] ?? throw new InvalidOperationException("ValidIssuer not configured"),
            ValidAudience = _configuration["JWT:ValidAudience"] ?? throw new InvalidOperationException("ValidAudience not configured"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateLifetime = false
        };

        return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
    }
}