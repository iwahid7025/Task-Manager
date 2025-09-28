import TaskItemRow from "./TaskItemRow";
import { type TaskItem } from "../api";

type Props = {
  items: TaskItem[];
  onUpdated: (t: TaskItem) => void;
  onDeleted: (id: number) => void;
};

const TaskList: React.FC<Props> = ({ items, onUpdated, onDeleted }) => {
  return items.length === 0 ? (
    <p>No tasks yet.</p>
  ) : (
    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
      {items.map((t) => (
        <TaskItemRow key={t.id} task={t} onUpdated={onUpdated} onDeleted={onDeleted} />
      ))}
    </ul>
  );
};

export default TaskList;