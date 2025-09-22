using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

var app = builder.Build();

app.MapGet("/health", () => "OK");

// LIST: GET /api/tasks
app.MapGet("/api/tasks", async (AppDbContext db) =>
{
    var items = await db.Tasks.AsNoTracking().ToListAsync();
    return Results.Ok(items);
});

// GET ONE: GET /api/tasks/{id}
app.MapGet("/api/tasks/{id:int}", async (int id, AppDbContext db) =>
{
    var item = await db.Tasks.FindAsync(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
});

// CREATE: POST /api/tasks
app.MapPost("/api/tasks", async (TaskCreateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
        return Results.ValidationProblem(new Dictionary<string, string[]>
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

    return Results.Created($"/api/tasks/{entity.Id}", entity);
});

// UPDATE: PUT /api/tasks/{id}
app.MapPut("/api/tasks/{id:int}", async (int id, TaskUpdateDto dto, AppDbContext db) =>
{
    var entity = await db.Tasks.FindAsync(id);
    if (entity is null) return Results.NotFound();

    if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 200)
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["Title"] = ["Title is required and must be <= 200 chars."]
        });

    entity.Title = dto.Title.Trim();
    entity.Description = dto.Description;
    entity.Status = dto.Status;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE: DELETE /api/tasks/{id}
app.MapDelete("/api/tasks/{id:int}", async (int id, AppDbContext db) =>
{
    var entity = await db.Tasks.FindAsync(id);
    if (entity is null) return Results.NotFound();

    db.Tasks.Remove(entity);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();