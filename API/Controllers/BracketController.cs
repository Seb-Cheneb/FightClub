using Data.Mappers;
using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.DTOs;
using Data.Entities;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BracketController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly DataContext _dataContext;

    public BracketController(ILogger<UserController> logger, DataContext context)
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
    public async Task<IActionResult> Add([FromBody] BracketCreateRequest request)
    {
        if (request is null)
        {
            return BadRequest("The creation request is bad");
        }

        try
        {
            var competition = await _dataContext.Competitions
                .Include(i => i.Brackets)
                .FirstOrDefaultAsync(i => i.Id == request.CompetitionId);

            if (competition == null)
            {
                return BadRequest("The competition provided null");
            }

            var match = BracketMapper.CreateModel(request);
            _dataContext.Brackets.Add(match);
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
            var output = await _dataContext.Brackets
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
            var output = await _dataContext.Brackets
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
    public async Task<IActionResult> GetById([FromQuery] string bracketId)
    {
        if (string.IsNullOrWhiteSpace(bracketId))
        {
            return BadRequest("bracketId is required");
        }

        try
        {
            var output = await _dataContext.Brackets
                .Include(e => e.Fighters)
                .FirstOrDefaultAsync(e => e.Id == bracketId);

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
            var data = await _dataContext.Brackets.FindAsync(id);
            if (data == null)
            {
                return NotFound();
            }
            _dataContext.Brackets.Remove(data);
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
    public async Task<IActionResult> Update([FromBody] BracketDto request)
    {
        try
        {
            var data = await _dataContext.Brackets.FindAsync(request.Id);
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
    public async Task<IActionResult> AddFighter([FromQuery] string bracketId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(bracketId) || string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var bracket = await _dataContext.Brackets.FindAsync(bracketId);
            var fighter = await _dataContext.Fighters.FirstOrDefaultAsync(e => e.Id == fighterId);

            if (bracket == null || fighter == null)
            {
                return NotFound();
            }

            if (bracket.Fighters.Contains(fighter))
            {
                return BadRequest("Fighter already enrolled in bracket");
            }

            bracket.Fighters.Add(fighter);
            await _dataContext.SaveChangesAsync();

            return Ok(bracket.CastToDto());
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
    public async Task<IActionResult> RemoveFighter([FromQuery] string bracketId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(bracketId) || string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var bracket = await _dataContext.Brackets
                .Include(i => i.Fighters)
                .FirstOrDefaultAsync(i => i.Id == bracketId);

            if (bracket == null)
            {
                return NotFound();
            }

            var fighter = bracket.Fighters.FirstOrDefault(i => i.Id == fighterId);

            if (fighter == null)
            {
                return BadRequest("Fighter isn't enrolled in bracket");
            }

            if (!bracket.Fighters.Any(i => i.Id == fighterId))
            {
                return BadRequest("Fighter isn't enrolled in bracket");
            }

            bracket.Fighters.Remove(fighter);

            await _dataContext.SaveChangesAsync();

            return Ok(bracket.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpPut("SetFighterPosition")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SetFighterPosition(
        [FromQuery] string bracketId,
        [FromQuery] string fighterId,
        [FromQuery] int position)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(bracketId) ||
                string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var bracket = await _dataContext
                .Brackets
                .Include(i => i.Positions)
                .FirstOrDefaultAsync(i => i.Id == bracketId);

            if (bracket == null)
            {
                return NotFound();
            }

            bracket.Positions.Add(new Position
            {
                Id = Guid.NewGuid().ToString(),
                BracketId = bracketId,
                Key = position,
                Value = fighterId
            });

            await _dataContext.SaveChangesAsync();

            return Ok(bracket.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize]
    [HttpPut("RemoveFighterPosition")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RemoveFighterPosition(
        [FromQuery] string bracketId,
        [FromQuery] string fighterId,
        [FromQuery] int position)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(bracketId) ||
                string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("The parameters provided are null");
            }

            var bracket = await _dataContext
                .Brackets
                .Include(i => i.Positions)
                .FirstOrDefaultAsync(i => i.Id == bracketId);

            if (bracket == null)
            {
                return NotFound();
            }

            bracket.Positions.Remove(bracket.Positions.FirstOrDefault(i => i.Key == position && i.Value == fighterId));
            await _dataContext.SaveChangesAsync();

            return Ok(bracket.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}