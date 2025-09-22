using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=tasks.db"));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/health", () => "Healthy");

app.Run();
