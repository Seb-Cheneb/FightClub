using Data.Entities;
using Data.Mappers;
using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.DTOs;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MatchController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly DataContext _dataContext;

    public MatchController(ILogger<UserController> logger, DataContext context)
    {
        _logger = logger;
        _dataContext = context;
    }

    [Authorize]
    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Add([FromBody] CreateMatchDto request)
    {
        if (request is null)
        {
            return BadRequest("The creation request is bad");
        }

        try
        {
            var competition = await _dataContext.Competitions.FindAsync(request.CompetitionId);

            if (competition == null)
            {
                return BadRequest("The competition provided null");
            }

            var matchNumber = competition.Matches.Count + 1;

            var match = MatchMapper.CreateModel(request);
            match.Number = matchNumber;
            _dataContext.Matches.Add(match);
            _dataContext.Competitions.Update(competition);

            await _dataContext.SaveChangesAsync();
            return Ok(match.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
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
            var output = await _dataContext.Matches
                .Include(e => e.Fighters)
                .ToListAsync();

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
            var output = await _dataContext.Matches
                .Include(i => i.Fighters)
                .Include(i => i.Competition)
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
    public async Task<IActionResult> GetById([FromQuery] string matchId)
    {
        try
        {
            var output = await _dataContext.Matches
                .Include(e => e.Fighters)
                .FirstOrDefaultAsync(e => e.Id == matchId);

            if (output is null) return NotFound();
            return Ok(output.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
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
        try
        {
            var data = await _dataContext.Matches.FindAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            _dataContext.Matches.Remove(data);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpPut("Update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromBody] MatchDto request)
    {
        try
        {
            var data = await _dataContext.Matches.FindAsync(request.Id);
            if (data == null)
            {
                return NotFound();
            }

            data.Update(request);
            await _dataContext.SaveChangesAsync();
            return Ok(data.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpPut("AddFighter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddFighter([FromQuery] string matchId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(matchId) || string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var match = await _dataContext.Matches.FindAsync(matchId);
            var fighter = await _dataContext.Fighters
                .Include(e => e.Matches)
                .FirstOrDefaultAsync(e => e.Id == fighterId);

            if (match == null || fighter == null)
            {
                return NotFound();
            }

            if (match.Fighters.Contains(fighter))
            {
                return BadRequest("Fighter already enrolled in match");
            }

            if (match.Fighters.Count >= 3)
            {
                return BadRequest("Maximum number of fighters reached");
            }

            match.Fighters.Add(fighter);
            await _dataContext.SaveChangesAsync();

            return Ok(match.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpPut("RemoveFighter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RemoveFighter([FromQuery] string matchId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(matchId) || string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var match = await _dataContext.Matches
                .Include(i => i.Fighters)
                .FirstOrDefaultAsync(i => i.Id == matchId);

            if (match == null)
            {
                return NotFound();
            }

            var fighter = match.Fighters.FirstOrDefault(i => i.Id == fighterId);
            if (fighter == null)
            {
                return BadRequest("Fighter isn't enrolled in match");
            }

            if (!match.Fighters.Any(i => i.Id == fighterId))
            {
                return BadRequest("Fighter isn't enrolled in match");
            }

            match.Fighters.Remove(fighter);

            await _dataContext.SaveChangesAsync();

            return Ok(match.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}