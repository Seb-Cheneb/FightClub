using API.Features.Fighters.Models;
using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Features.Fighters;

[Route("api/[controller]")]
[ApiController]
public class FighterController : ControllerBase
{
    private readonly ILogger<FighterController> _logger;
    private readonly DataContext _dataContext;

    public FighterController(ILogger<FighterController> logger, DataContext context)
    {
        _logger = logger;
        _dataContext = context;
    }

    [Authorize]
    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Add([FromBody] FighterCreateRequest request)
    {
        try
        {
            if (request is null)
            {
                return BadRequest("Request body cannot be null");
            }

            var club = await _dataContext.Clubs
                .Include(i => i.Fighters)
                .FirstOrDefaultAsync(i => i.Id == request.ClubId);

            if (club == null)
            {
                return BadRequest("Club not found");
            }

            var fighter = request.CreateModel();
            _dataContext.Fighters.Add(fighter);
            _dataContext.Clubs.Update(club);
            await _dataContext.SaveChangesAsync();

            return Ok(fighter.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An internal server error occurred");
        }
    }

    [Authorize]
    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var output = await _dataContext.Fighters
                .Include(i => i.Competitions)
                .Include(i => i.Club)
                .ToListAsync();

            if (output.Count == 0)
            {
                return NotFound();
            }

            var dtos = output.Select(entry => entry.CastToDto()).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpGet("GetAllById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllById([FromQuery(Name = "id")] List<string> ids)
    {
        try
        {
            var output = await _dataContext.Fighters
                .Include(i => i.Competitions)
                .Include(i => i.Club)
                .Where(i => ids.Contains(i.Id ?? "NULL"))
                .ToListAsync();

            if (output is null)
            {
                return NotFound("No entries were found");
            }

            return Ok(output.Select(i => i.CastToDto()));
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [Authorize]
    [HttpGet("GetById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById([FromQuery] string id)
    {
        var logMethod = "GetById";
        _logger.LogInformation($"{logMethod} :: Received request");

        try
        {
            var output = await _dataContext.Fighters
                .Include(i => i.Competitions)
                .Include(i => i.Club)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (output is null)
            {
                var logMessage = $"{logMethod} :: No entry found";
                _logger.LogWarning(logMessage);
                return NotFound(logMessage);
            }

            _logger.LogInformation($"{logMethod} :: Request successful");

            return Ok(output.CastToDto());
        }
        catch (Exception ex)
        {
            var logMessage = $"{logMethod} :: Error while processing request";
            _logger.LogError(ex, logMessage);
            return StatusCode(StatusCodes.Status500InternalServerError, logMessage);
        }
    }

    [Authorize]
    [HttpDelete("Delete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete([FromQuery] string id)
    {
        var logMethod = "Delete";
        _logger.LogInformation($"{logMethod} :: Received request");

        try
        {
            var data = await _dataContext.Fighters.FindAsync(id);

            if (data == null)
            {
                var logMessage = $"{logMethod} :: No entry found";
                _logger.LogWarning(logMessage);
                return NotFound(logMessage);
            }

            _dataContext.Fighters.Remove(data);

            await _dataContext.SaveChangesAsync();

            _logger.LogInformation($"{logMethod} :: Request successful");

            return NoContent();
        }
        catch (Exception ex)
        {
            var logMessage = $"{logMethod} :: Error while processing request";
            _logger.LogError(ex, logMessage);
            return StatusCode(StatusCodes.Status500InternalServerError, logMessage);
        }
    }

    [Authorize]
    [HttpPut("Update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromBody] FighterDto request)
    {
        try
        {
            var data = await _dataContext.Fighters
                .Include(i => i.Competitions)
                .Include(i => i.Club)
                .FirstOrDefaultAsync(i => i.Id == request.Id);

            if (data == null)
            {
                return NotFound("fighter is null");
            }

            data.Update(request);

            _dataContext.Fighters.Update(data);

            await _dataContext.SaveChangesAsync();

            return Ok(data.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}