import { useState } from "react";
import { Status, updateTask, createTask } from "../api";
import type { TaskCreateDto, TaskItem } from "../api";

type Props = {
  // if editing, pass an existing task; otherwise it's a create form
  initial?: TaskItem | null;
  onSaved: (saved: TaskItem) => void;  // parent updates the list
  onCancel?: () => void;
};

const TaskForm: React.FC<Props> = ({ initial = null, onSaved, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? Status.Todo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (initial) {
        await updateTask(initial.id, { title: title.trim(), description: description.trim() || null, status });
        // return the updated shape for parent to merge
        onSaved({ ...initial, title: title.trim(), description: description.trim() || null, status });
      } else {
        const created = await createTask({ title: title.trim(), description: description.trim() || null, status } as TaskCreateDto);
        onSaved(created);
        setTitle("");
        setDescription("");
        setStatus(Status.Todo);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
      <input
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
      />
      <textarea
        placeholder="Description (optional)"
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <select value={status} onChange={(e) => setStatus(Number(e.target.value) as Status)}>
        <option value={Status.Todo}>Todo</option>
        <option value={Status.InProgress}>In Progress</option>
        <option value={Status.Done}>Done</option>
      </select>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving}>{initial ? "Save" : "Add Task"}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>

      {error && <small style={{ color: "crimson" }}>Error: {error}</small>}
    </form>
  );
};

export default TaskForm;