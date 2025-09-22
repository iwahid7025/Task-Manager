namespace TaskApi.Models;

public record TaskCreateDto(string Title, string? Description, Status Status);
public record TaskUpdateDto(string Title, string? Description, Status Status);