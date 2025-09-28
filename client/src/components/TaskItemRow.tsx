import { useState } from "react";
import { type TaskItem, deleteTask } from "../api";
import TaskForm from "./TaskFrom";

type Props = {
  task: TaskItem;
  onUpdated: (t: TaskItem) => void;
  onDeleted: (id: number) => void;
};

const TaskItemRow: React.FC<Props> = ({ task, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSaved = (saved: TaskItem) => {
    onUpdated(saved);
    setEditing(false);
  };

  const handleDelete = async () => {
    setErr(null);
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <li style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
      {editing ? (
        <TaskForm initial={task} onSaved={handleSaved} onCancel={() => setEditing(false)} />
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div>
            <strong>{task.title}</strong>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{task.status === 0 ? "Todo" : task.status === 1 ? "In Progress" : "Done"}</div>
            {task.description && <p style={{ marginTop: 6 }}>{task.description}</p>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
      {err && <small style={{ color: "crimson" }}>Error: {err}</small>}
    </li>
  );
};

export default TaskItemRow;