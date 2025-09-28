using System.ComponentModel.DataAnnotations;
using TaskApi.Models;

namespace TaskApi.Models;

public record TaskCreateDto(
    [Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);

public record TaskUpdateDto(
    [Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);