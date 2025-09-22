using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

namespace TaskApi.Controllers;

[ApiController]                                  // Enables API behaviors (automatic 400 on invalid model, binding source inference, etc.)
[Route("api/[controller]")]                      // Base route = /api/tasks
public class TasksController(AppDbContext db) : ControllerBase
{
    // GET: /api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
    {
        var items = await db.Tasks.AsNoTracking().ToListAsync();
        return Ok(items);
    }

    // GET: /api/tasks/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id)
    {
        var item = await db.Tasks.FindAsync(id);
        if (item is null) return NotFound();
        return Ok(item);
    }

    // POST: /api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create(TaskCreateDto dto)
    {
        // With [ApiController], data binding and validation integrate cleanly.
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
            return BadRequest(new Dictionary<string, string[]>
            {
                ["Title"] = ["Title is required and must be <= 200 chars."]
            });

        var entity = new TaskItem
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Status = dto.Status
        };

        db.Tasks.Add(entity);
        await db.SaveChangesAsync();

        // Returns 201 + Location header to GET by id
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    // PUT: /api/tasks/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TaskUpdateDto dto)
    {
        var entity = await db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
            return BadRequest(new Dictionary<string, string[]>
            {
                ["Title"] = ["Title is required and must be <= 200 chars."]
            });

        entity.Title = dto.Title.Trim();
        entity.Description = dto.Description;
        entity.Status = dto.Status;

        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: /api/tasks/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        db.Tasks.Remove(entity);
        await db.SaveChangesAsync();
        return NoContent();
    }
}