using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

// Create the web application builder with default configuration
var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework Core with SQLite database
// This sets up the database context to use SQLite with a local file called "tasks.db"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

// Configure Cross-Origin Resource Sharing (CORS) to allow frontend access
// This is essential for allowing the React frontend to communicate with the API
const string ClientPolicy = "ClientPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: ClientPolicy, policy =>
    {
        policy
            // Allow requests from React development server and common alternative ports
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
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