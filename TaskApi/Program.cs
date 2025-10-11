using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

// Create the web application builder with default configuration
var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
var root = Directory.GetCurrentDirectory();
var dotenv = Path.Combine(root, ".env");
if (File.Exists(dotenv))
{
    foreach (var line in File.ReadAllLines(dotenv))
    {
        if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            continue;
        var parts = line.Split('=', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 2)
            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
    }
}

// Configure Entity Framework Core with SQLite database
// This sets up the database context to use SQLite with a local file called "tasks.db"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

builder.Services.AddHttpClient();

// Configure Cross-Origin Resource Sharing (CORS) to allow frontend access
// This is essential for allowing the React frontend to communicate with the API
const string ClientPolicy = "ClientPolicy";
var corsOriginsEnv = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS") ?? string.Empty;
var allowedOrigins = corsOriginsEnv.Split(';', StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ClientPolicy, policy =>
    {
        policy
            // Allow requests from React development server and configured origins
            .WithOrigins(allowedOrigins)
            // Allow any headers in requests (Content-Type, Authorization, etc.)
            .AllowAnyHeader()
            // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
            .AllowAnyMethod();
        // Note: .AllowCredentials() would be needed only for cookie-based authentication
    });
});

// Register MVC controllers for handling API endpoints
// This enables attribute-based routing and controller dependency injection
builder.Services.AddControllers();

// Build the configured web application
var app = builder.Build();

// Configure a simple health check endpoint for monitoring application status
// This can be used by load balancers or monitoring tools to verify the API is running
app.MapGet("/health", () => "OK");

// Enable CORS middleware in the request pipeline
// This must be called before MapControllers() to apply CORS policies to controller routes
app.UseCors(ClientPolicy);

// Enable controller routing to handle incoming HTTP requests
// Controllers will be discovered automatically based on their attributes
app.MapControllers();

// Start the web application and listen for incoming requests
app.Run();