namespace TaskApi.Models;

public enum Status
{
    Todo = 0,
    InProgress = 1,
    Done = 2
}

public class TaskItem
{
    public int Id { get; set; }              // PK
    public string Title { get; set; } = "";  // required
    public string? Description { get; set; } // optional
    public Status Status { get; set; } = Status.Todo;
}