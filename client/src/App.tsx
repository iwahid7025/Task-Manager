// src/App.tsx
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  Status,
} from "./api";
import type { TaskItem } from "./api";

const App = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.Todo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on first render
  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || null,
        status,
      });
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setStatus(Status.Todo);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onDelete = async (id: number) => {
    setError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Task Manager (React + ASP.NET + SQLite)</h1>

      <form onSubmit={onCreate} style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <select
          value={status}
          onChange={(e) => setStatus(Number(e.target.value) as Status)}
        >
          <option value={Status.Todo}>Todo</option>
          <option value={Status.InProgress}>In Progress</option>
          <option value={Status.Done}>Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet—add one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.5rem" }}>
          {tasks.map((t) => (
            <li key={t.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {t.status === Status.Todo
                      ? "Todo"
                      : t.status === Status.InProgress
                      ? "In Progress"
                      : "Done"}
                  </div>
                  {t.description && <p style={{ marginTop: 6 }}>{t.description}</p>}
                </div>
                <button onClick={() => onDelete(t.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;