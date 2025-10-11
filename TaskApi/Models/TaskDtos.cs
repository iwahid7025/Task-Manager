using System.ComponentModel.DataAnnotations;
using TaskApi.Models;

namespace TaskApi.Models;

/// <summary>
/// Data Transfer Object (DTO) for creating new tasks.
/// Uses record type for immutability and built-in equality comparison.
/// Contains validation attributes for automatic model validation in ASP.NET Core.
/// </summary>
/// <param name="Title">
/// The title of the task to be created.
/// Required field with maximum length of 200 characters.
/// </param>
/// <param name="Description">
/// Optional description providing additional details about the task.
/// Can be null or empty if no additional context is needed.
/// </param>
/// <param name="Status">
/// The initial status of the task (Todo, InProgress, or Done).
/// Typically starts as Todo for new tasks.
/// </param>
public record TaskCreateDto(
    [Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);

/// <summary>
/// Data Transfer Object (DTO) for updating existing tasks.
/// Uses record type for immutability and contains the same validation as TaskCreateDto.
/// Separate from TaskCreateDto to allow for different validation rules in the future.
/// </summary>
/// <param name="Title">
/// The updated title of the task.
/// Required field with maximum length of 200 characters.
/// </param>
/// <param name="Description">
/// Updated description of the task.
/// Optional field that can be null, empty, or contain detailed information.
/// </param>
/// <param name="Status">
/// The updated status of the task.
/// Can be changed to reflect progress (Todo → InProgress → Done).
/// </param>
public record TaskUpdateDto(
    [Required, StringLength(200)] string Title,
    string? Description,
    Status Status
);