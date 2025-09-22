using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Basic validation: Title required & short length
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);
    }
}