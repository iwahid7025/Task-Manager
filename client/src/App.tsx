import { useEffect, useState } from "react";
import TaskForm from "./components/TaskFrom";
import TaskList from "./components/TaskList";
import { getTasks, type TaskItem } from "./api";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load once
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreated = (created: TaskItem) => setTasks((prev) => [created, ...prev]);
  const handleUpdated = (updated: TaskItem) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const handleDeleted = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Task Manager</h1>

      <TaskForm onSaved={handleCreated} />

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {loading ? <p>Loading…</p> : <TaskList items={tasks} onUpdated={handleUpdated} onDeleted={handleDeleted} />}
    </div>
  );
};

export default App;