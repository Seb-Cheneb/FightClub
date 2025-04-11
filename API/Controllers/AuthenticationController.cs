using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Data.Entities;
using Data.Authentication;
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

    public AuthenticationController(UserManager<AppUser> userManager, IConfiguration configuration,
        ILogger<AuthenticationController> logger)
    {
        _userManager = userManager;
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

        var token = GenerateJwt(model.Username);

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
            UserId = user.Id
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

        if (user is null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry < DateTime.UtcNow)
            return Unauthorized();

        var token = GenerateJwt(principal.Identity.Name);

        _logger.LogInformation("Refresh succeeded");

        return Ok(new AuthenticationResponse
        {
            JwtToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpirationDate = token.ValidTo,
            RefreshToken = model.RefreshToken,
            UserId = user.Id
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

        // Generate JWT token
        var jwtToken = GenerateJwt(model.Username);

        // Generate a new refresh token
        var refreshToken = GenerateRefreshToken();

        // Update user with the generated refresh token and its expiry time
        newUser.RefreshToken = refreshToken;
        newUser.RefreshTokenExpiry = DateTime.UtcNow.AddMinutes(60);

        // Update the user in the database
        var updateResult = await _userManager.UpdateAsync(newUser);
        if (!updateResult.Succeeded)
        {
            _logger.LogError("Failed to update user refresh token for {Username}: {Errors}",
                            model.Username,
                            string.Join(", ", updateResult.Errors.Select(e => e.Description)));
            return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user refresh token.");
        }

        // Log success and return the authentication response
        _logger.LogInformation("User {Username} registered successfully.", model.Username);

        var response = new AuthenticationResponse
        {
            JwtToken = new JwtSecurityTokenHandler().WriteToken(jwtToken),
            ExpirationDate = jwtToken.ValidTo,
            RefreshToken = refreshToken,
            UserId = newUser.Id
        };

        return Ok(response);
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

        if (username is null)
            return Unauthorized();

        var user = await _userManager.FindByNameAsync(username);

        if (user is null)
            return Unauthorized();

        user.RefreshToken = string.Empty;

        await _userManager.UpdateAsync(user);

        _logger.LogInformation("Revoke succeeded");

        return Ok();
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var generator = RandomNumberGenerator.Create();
        generator.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private JwtSecurityToken GenerateJwt(string username)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] ??
                                                                  throw new InvalidOperationException(
                                                                      "Secret not configured")));

        var token = new JwtSecurityToken(
            _configuration["JWT:ValidIssuer"],
            _configuration["JWT:ValidAudience"],
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
            ValidIssuer = _configuration["JWT:ValidIssuer"] ??
                          throw new InvalidOperationException("ValidIssuer not configured"),
            ValidAudience = _configuration["JWT:ValidAudience"] ??
                            throw new InvalidOperationException("ValidAudience not configured"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateLifetime = false
        };

        return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
    }
}