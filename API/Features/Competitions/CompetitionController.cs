using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Features.Brackets;
using API.Features.Competitions.Models;

namespace API.Features.Competitions;

[Route("api/[controller]")]
[ApiController]
public class CompetitionController : ControllerBase
{
    private readonly IBracketService _bracketService;
    private readonly DataContext _dataContext;
    private readonly ILogger<CompetitionController> _logger;

    public CompetitionController(ILogger<CompetitionController> logger, DataContext context, IBracketService bracketService)
    {
        _logger = logger;
        _dataContext = context;
        _bracketService = bracketService;
    }

    [Authorize]
    [HttpPost("AddFighter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddFighter([FromQuery] string competitionId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(competitionId))
            {
                return BadRequest("Competition ID is required and cannot be null, empty, or whitespace.");
            }

            if (string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("User ID is required and cannot be null, empty, or whitespace.");
            }

            var competition = await _dataContext.Competitions
                .Include(e => e.Fighters)
                .Include(e => e.Brackets)
                .FirstOrDefaultAsync(e => e.Id == competitionId);

            if (competition is null)
            {
                return NotFound($"Competition with ID '{competitionId}' not found.");
            }

            var fighter = await _dataContext.Fighters.FindAsync(fighterId);

            if (fighter is null)
            {
                return NotFound($"User with ID '{fighterId}' not found.");
            }

            if (competition.Fighters.Any(f => f.Id == fighterId))
            {
                return Conflict($"Fighter '{fighter.Name}' is already part of competition '{competition.Name}'.");
            }

            competition.Fighters.Add(fighter);

            //var bracketStatus = await _bracketService.AddFighterToCompetition(competitionId, fighter);
            //if (!bracketStatus)
            //{
            //    _logger.LogError($"Failed to add fighter '{fighter.Name}' to bracket'.");
            //}

            await _dataContext.SaveChangesAsync();

            return Ok(competition.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [Authorize]
    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] CompetitionCreateRequest? request)
    {
        try
        {
            if (request is null)
            {
                return BadRequest("The request body cannot be null.");
            }

            var model = request.CreateModel();

            _dataContext.Competitions.Add(model);

            await _dataContext.SaveChangesAsync();

            return Ok(model.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
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
            var data = await _dataContext.Competitions.FindAsync(id);

            if (data == null)
            {
                return NotFound();
            }

            _dataContext.Competitions.Remove(data);

            await _dataContext.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var output = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .Include(i => i.Brackets)
                .ToListAsync();

            if (output.Count == 0)
            {
                return NotFound("No entries were found");
            }

            var dtos = output
                .Select(entry => entry.CastToDto()).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("GetAllById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllById([FromQuery(Name = "id")] List<string> ids)
    {
        try
        {
            var output = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .Include(i => i.Brackets)
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

    [HttpGet("GetById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById([FromQuery] string id)
    {
        try
        {
            var output = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .Include(i => i.Brackets)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (output is null)
            {
                return NotFound("No entries were found");
            }

            return Ok(output.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [Authorize]
    [HttpPost("RemoveFighter")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveFighter([FromQuery] string competitionId, [FromQuery] string fighterId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(competitionId))
            {
                return BadRequest("Competition ID is required and cannot be null, empty, or whitespace.");
            }

            if (string.IsNullOrWhiteSpace(fighterId))
            {
                return BadRequest("User ID is required and cannot be null, empty, or whitespace.");
            }

            var competition = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .FirstOrDefaultAsync(i => i.Id == competitionId);

            if (competition is null)
            {
                return NotFound($"Competition with ID '{competitionId}' not found.");
            }

            var fighter = await _dataContext.Fighters.FindAsync(fighterId);

            if (fighter is null)
            {
                return NotFound($"User with ID '{fighterId}' not found.");
            }

            if (!competition.Fighters.Any(i => i.Id == fighterId))
            {
                return BadRequest("The fighter isn't part of the match");
            }

            competition.Fighters.Remove(fighter);
            //var bracketStatus = await _bracketService.RemoveFighterFromCompetition(competitionId, fighterId);
            //if (!bracketStatus)
            //{
            //    _logger.LogError($"Failed to remove fighter '{fighter.Name}' from bracket'.");
            //}

            await _dataContext.SaveChangesAsync();

            return Ok(competition.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [Authorize]
    [HttpPut("Update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromBody] CompetitionDto request)
    {
        try
        {
            var data = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .Include(i => i.Brackets)
                .FirstOrDefaultAsync(i => i.Id == request.Id);

            if (data == null)
            {
                return NotFound();
            }

            data.Update(request);

            _dataContext.Competitions.Update(data);

            await _dataContext.SaveChangesAsync();

            return Ok(data.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [Authorize]
    [HttpGet("IsFighterInCompetition")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> IsFighterInCompetition(
    [FromQuery] string competitionId,
    [FromQuery] string fighterId)
    {
        try
        {
            var competition = await _dataContext.Competitions
                .Include(i => i.Fighters)
                .FirstOrDefaultAsync(i => i.Id == competitionId);

            if (competition == null)
            {
                return NotFound("No competition found");
            }

            var fighter = await _dataContext.Fighters.FirstOrDefaultAsync(i => i.Id == fighterId);

            if (fighter == null)
            {
                return NotFound("No fighter found");
            }

            if (competition.Fighters.Contains(fighter))
            {
                return Ok(true);
            }

            return Ok(false);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }
}