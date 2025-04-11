using API.Persistence;
using Data.DTOs;
using Data.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly DataContext _repository;

    public UserController(ILogger<UserController> logger, DataContext repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [Authorize]
    [HttpGet("GetUsers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var output = await _repository.AppUsers.ToListAsync();

            if (output.Count == 0)
            {
                return NotFound("No entries were found");
            }

            return Ok(output.Select(UserMapper.CastToDto).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while processing request.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error has occurred.");
        }
    }

    [Authorize]
    [HttpPut("Update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Update([FromBody] AppUserDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Id))
            {
                return BadRequest("ID is required and cannot be null, empty, or whitespace.");
            }

            if (request is null)
            {
                return BadRequest("Entity cannot be null.");
            }

            var user = await _repository.AppUsers.FindAsync(request.Id);

            if (user is null)
            {
                return NotFound("User not found.");
            }

            user.UpdateUser(request);

            _repository.Entry(user).State = EntityState.Modified;

            await _repository.SaveChangesAsync();

            return Ok(user.CastToDto());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while processing request.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error has occurred.");
        }
    }
}