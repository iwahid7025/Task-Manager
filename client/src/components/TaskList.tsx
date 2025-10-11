/**
 * TaskList Component - Container for displaying a list of tasks
 * 
 * This component serves as a container that renders a collection of tasks.
 * It handles the empty state when no tasks exist and delegates individual
 * task rendering to the TaskItemRow component. The component is purely
 * presentational and passes through event handlers to child components.
 */

import TaskItemRow from "./TaskItemRow";
import { type TaskItem } from "../api";

/**
 * Props interface for the TaskList component
 */
type Props = {
  /** Array of task items to display in the list */
  items: TaskItem[];
  
  /** 
   * Callback function called when a task is updated.
   * Passed down to TaskItemRow components for handling edit operations.
   */
  onUpdated: (t: TaskItem) => void;
  
  /** 
   * Callback function called when a task is deleted.
   * Passed down to TaskItemRow components for handling delete operations.
   */
  onDeleted: (id: number) => void;
};

/**
 * Container component that renders a list of tasks or an empty state message.
 * 
 * Features:
 * - Displays a friendly message when no tasks exist
 * - Renders tasks in a clean, unstyled list layout
 * - Uses CSS Grid for consistent spacing between items
 * - Delegates individual task rendering to TaskItemRow components
 * - Passes through event handlers for task operations
 * - Uses task ID as React key for optimal rendering performance
 */
const TaskList: React.FC<Props> = ({ items, onUpdated, onDeleted }) => {
  // Conditional rendering based on whether tasks exist
  return items.length === 0 ? (
    // Empty state - show friendly message when no tasks exist
    <p>No tasks yet.</p>
  ) : (
    // Task list - render all tasks in a clean list layout
    <ul style={{ 
      listStyle: "none",    // Remove default bullet points
      padding: 0,           // Remove default padding
      display: "grid",      // Use CSS Grid for layout
      gap: 8                // Consistent spacing between items
    }}>
      {items.map((t) => (
        <TaskItemRow 
          key={t.id}                    // Use task ID as React key for performance
          task={t}                      // Pass task data to child component
          onUpdated={onUpdated}         // Pass through update handler
          onDeleted={onDeleted}         // Pass through delete handler
        />
      ))}
    </ul>
  );
};

export default TaskList;