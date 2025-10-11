using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

namespace TaskApi.Controllers;

/// <summary>
/// RESTful API controller for managing tasks in the task management system.
/// Provides full CRUD (Create, Read, Update, Delete) operations for TaskItem entities.
/// </summary>
[ApiController]                                  // Enables API behaviors (automatic 400 on invalid model, binding source inference, etc.)
[Route("api/[controller]")]                      // Base route = /api/tasks (controller name without "Controller" suffix)
public class TasksController(AppDbContext db) : ControllerBase
{
    /// <summary>
    /// Retrieves all tasks from the database.
    /// Uses AsNoTracking() for better performance since we're only reading data.
    /// </summary>
    /// <returns>A list of all TaskItem objects</returns>
    /// <response code="200">Returns the list of tasks</response>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
    {
        // AsNoTracking() improves performance for read-only operations
        // by not tracking entities in the EF Core change tracker
        var items = await db.Tasks.AsNoTracking().ToListAsync();
        return Ok(items);
    }

    /// <summary>
    /// Retrieves a specific task by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the task</param>
    /// <returns>The TaskItem if found, otherwise NotFound</returns>
    /// <response code="200">Returns the task item</response>
    /// <response code="404">If the task with the specified ID is not found</response>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id)
    {
        // FindAsync is optimal for finding by primary key
        var item = await db.Tasks.FindAsync(id);
        if (item is null) return NotFound();
        return Ok(item);
    }

    /// <summary>
    /// Creates a new task in the database.
    /// Validates the input data and returns the created task with its assigned ID.
    /// </summary>
    /// <param name="dto">The task creation data transfer object</param>
    /// <returns>The created TaskItem with assigned ID</returns>
    /// <response code="201">Returns the newly created task</response>
    /// <response code="400">If the task data is invalid</response>
    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create(TaskCreateDto dto)
    {
        // Manual validation for business rules
        // The [ApiController] attribute provides automatic model validation for basic cases
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
            return BadRequest(new Dictionary<string, string[]>
            {
                ["Title"] = ["Title is required and must be <= 200 chars."]
            });

        // Create new entity from DTO
        // This mapping could be handled by AutoMapper in larger applications
        var entity = new TaskItem
        {
            Title = dto.Title.Trim(),           // Remove leading/trailing whitespace
            Description = dto.Description,       // Optional field, can be null
            Status = dto.Status                 // Enum value for task status
        };

        // Add to context and save to database
        db.Tasks.Add(entity);
        await db.SaveChangesAsync();

        // Return 201 Created with Location header pointing to the new resource
        // This follows REST conventions for resource creation
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    /// <summary>
    /// Updates an existing task with new data.
    /// Performs a full update of the task properties.
    /// </summary>
    /// <param name="id">The unique identifier of the task to update</param>
    /// <param name="dto">The task update data transfer object</param>
    /// <returns>NoContent if successful, NotFound if task doesn't exist, BadRequest if data is invalid</returns>
    /// <response code="204">If the task was successfully updated</response>
    /// <response code="400">If the task data is invalid</response>
    /// <response code="404">If the task with the specified ID is not found</response>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TaskUpdateDto dto)
    {
        // Find the existing entity
        var entity = await db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        // Validate the updated data
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
            return BadRequest(new Dictionary<string, string[]>
            {
                ["Title"] = ["Title is required and must be <= 200 chars."]
            });

        // Update entity properties
        // EF Core will track these changes and generate appropriate SQL
        entity.Title = dto.Title.Trim();
        entity.Description = dto.Description;
        entity.Status = dto.Status;

        // Save changes to database
        await db.SaveChangesAsync();

        // Return 204 No Content as per REST conventions for successful updates
        return NoContent();
    }

    /// <summary>
    /// Deletes a specific task from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the task to delete</param>
    /// <returns>NoContent if successful, NotFound if task doesn't exist</returns>
    /// <response code="204">If the task was successfully deleted</response>
    /// <response code="404">If the task with the specified ID is not found</response>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Find the entity to delete
        var entity = await db.Tasks.FindAsync(id);
        if (entity is null) return NotFound();

        // Remove from context and save changes
        db.Tasks.Remove(entity);
        await db.SaveChangesAsync();

        // Return 204 No Content as per REST conventions for successful deletions
        return NoContent();
    }
}