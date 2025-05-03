using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Features.Clubs.Models;

namespace API.Features.Clubs;

[Route("api/[controller]")]
[ApiController]
public class ClubController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ClubController(DataContext context)
    {
        _dataContext = context;
    }

    [Authorize(Roles = "Moderator")]
    [HttpPost("Add")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Add([FromBody] ClubCreateRequest request)
    {
        try
        {
            if (request == null)
            {
                return BadRequest("The request is null");
            }

            var user = await _dataContext.AppUsers
                .Include(i => i.Club)
                .FirstOrDefaultAsync(i => i.Id == request.AppUserId);

            if (user == null)
            {
                return BadRequest("The user is null");
            }

            if (user.Club != null)
            {
                return BadRequest("The user already has a club");
            }

            var club = ClubMapper.CreateModel(request);
            _dataContext.Clubs.Add(club);
            _dataContext.AppUsers.Update(user);
            await _dataContext.SaveChangesAsync();

            return Ok(club.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [HttpGet("GetAll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var output = await _dataContext.Clubs
                .Include(club => club.AppUser)
                .Include(club => club.Fighters)
                .ToListAsync();

            var response = output.Select(entry => entry.CastToDto()).ToList();
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [HttpGet("GetAllById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllById([FromQuery(Name = "id")] List<string> ids)
    {
        try
        {
            var output = await _dataContext.Clubs
                .Include(club => club.AppUser)
                .Include(club => club.Fighters)
                .Where(i => ids.Contains(i.Id ?? "NULL"))
                .ToListAsync();

            if (output is null)
            {
                return NotFound("No entries were found");
            }

            return Ok(output.Select(i => i.CastToDto()).ToList());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("GetById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById([FromQuery] string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest("bracketId is required");
        }

        try
        {
            var output = await _dataContext.Clubs
                .Include(club => club.AppUser)
                .Include(club => club.Fighters)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (output is null)

            {
                return NotFound();
            }

            return Ok(output.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [HttpGet("GetByUserId")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetByUserId([FromQuery] string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("id is null");
            }

            var club = await _dataContext.Clubs
                .Include(club => club.Fighters)
                .FirstOrDefaultAsync(e => e.AppUserId == id);

            if (club == null)
            {
                return BadRequest("club has no club");
            }

            return Ok(club.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize(Roles = "Moderator")]
    [HttpPut("Update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromQuery] string clubId, string name)
    {
        try
        {
            var club = await _dataContext.Clubs.FindAsync(clubId);

            if (club == null)
            {
                return NotFound($"no clubs found with id: {clubId}");
            }

            club.Name = name;

            await _dataContext.SaveChangesAsync();

            return Ok(club.CastToDto());
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [Authorize(Roles = "Moderator")]
    [HttpDelete("Delete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete([FromQuery] string id)
    {
        try
        {
            var club = await _dataContext.Clubs.FindAsync(id);

            if (club == null)
            {
                return NotFound();
            }

            _dataContext.Clubs.Remove(club);
            await _dataContext.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}