using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

// ✅ Add controller support
builder.Services.AddControllers();

var app = builder.Build();

// (Optional) still keep a quick health endpoint
app.MapGet("/health", () => "OK");

// ✅ Map attribute-routed controllers
app.MapControllers();

app.Run();