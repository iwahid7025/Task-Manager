using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data;

/// <summary>
/// Entity Framework Core database context for the Task Management application.
/// This class serves as the bridge between the application and the SQLite database,
/// managing entity relationships, database configuration, and query execution.
/// </summary>
/// <param name="options">Database context options containing connection string and provider configuration</param>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    /// DbSet representing the Tasks table in the database.
    /// Provides LINQ queryable interface for TaskItem entities.
    /// Using the newer Set<T>() method instead of traditional DbSet<T> property.
    /// </summary>
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    /// <summary>
    /// Configures entity models and database schema using Fluent API.
    /// This method is called when the model for a derived context has been initialized,
    /// but before the model has been locked down and used to initialize the context.
    /// </summary>
    /// <param name="modelBuilder">The model builder used to configure the database schema</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure TaskItem entity properties and constraints
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Title)
            .IsRequired()           // Makes Title a required field (NOT NULL in database)
            .HasMaxLength(200);     // Sets maximum character limit for Title column

        // Note: Other properties (Id, Description, Status) use default EF Core conventions:
        // - Id: Primary key with auto-increment (IDENTITY column)
        // - Description: Optional text field (nullable)
        // - Status: Enum stored as integer in database

        // Call base implementation to ensure any base class configurations are applied
        base.OnModelCreating(modelBuilder);
    }
}