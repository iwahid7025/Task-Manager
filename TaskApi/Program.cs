using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

// CORS: register a named policy for your React dev origins
const string ClientPolicy = "ClientPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ClientPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
        // .AllowCredentials(); // only if you plan to send cookies/auth from the browser
    });
});


// Add controller support
builder.Services.AddControllers();

var app = builder.Build();

// (Optional) still keep a quick health endpoint
app.MapGet("/health", () => "OK");

// Plug CORS middleware into the pipeline (see step 34)
app.UseCors(ClientPolicy);

// Map attribute-routed controllers
app.MapControllers();

app.Run();