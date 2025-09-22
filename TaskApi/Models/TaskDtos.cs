using System.ComponentModel.DataAnnotations;

namespace TaskApi.Models;

public record TaskCreateDto(
    [property: Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);

public record TaskUpdateDto(
    [property: Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);