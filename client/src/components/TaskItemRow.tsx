/**
 * TaskItemRow Component - Individual task display and interaction
 * 
 * This component handles the display and interaction for a single task item.
 * It supports two modes:
 * 1. View mode - displays task information with action buttons
 * 2. Edit mode - shows the TaskForm component for editing
 * 
 * Features:
 * - Toggle between view and edit modes
 * - Delete functionality with error handling
 * - Status display with human-readable labels
 * - Conditional description rendering
 * - Inline error display for delete operations
 */

import { useState } from "react";
import { type TaskItem, deleteTask, Status } from "../api";
import TaskForm from "./TaskFrom";

/**
 * Props interface for the TaskItemRow component
 */
type Props = {
  /** The task item to display and interact with */
  task: TaskItem;
  
  /** 
   * Callback function called when the task is successfully updated.
   * Used to notify parent component for optimistic UI updates.
   */
  onUpdated: (t: TaskItem) => void;
  
  /** 
   * Callback function called when the task is successfully deleted.
   * Used to notify parent component to remove task from the list.
   */
  onDeleted: (id: number) => void;
};

/**
 * Individual task row component that displays task information and provides edit/delete actions.
 * 
 * Features:
 * - Dual mode operation (view/edit)
 * - Inline editing using TaskForm component
 * - Delete functionality with error handling
 * - Responsive layout with proper spacing
 * - Status display with human-readable text
 * - Conditional rendering for optional fields
 */
const TaskItemRow: React.FC<Props> = ({ task, onUpdated, onDeleted }) => {
  // Component state management
  
  /** Controls whether the task is in edit mode (true) or view mode (false) */
  const [editing, setEditing] = useState(false);
  
  /** Error state for displaying delete operation errors */
  const [err, setErr] = useState<string | null>(null);

  /**
   * Handler for when a task is successfully saved in edit mode.
   * Updates the parent component and exits edit mode.
   * 
   * @param saved - The updated task item returned from the API
   */
  const handleSaved = (saved: TaskItem) => {
    onUpdated(saved);    // Notify parent of the update
    setEditing(false);   // Exit edit mode
  };

  /**
   * Handler for task deletion.
   * Calls the delete API and notifies the parent component on success.
   * Displays error message if the deletion fails.
   */
  const handleDelete = async () => {
    setErr(null); // Clear any previous errors
    
    try {
      await deleteTask(task.id);  // Call API to delete task
      onDeleted(task.id);         // Notify parent to remove from list
    } catch (e: any) {
      setErr(e.message);          // Display error to user
    }
  };

  /**
   * Converts the numeric status enum to human-readable text.
   * Uses explicit comparison for clarity and type safety.
   * 
   * @param status - The Status enum value
   * @returns Human-readable status string
   */
  const getStatusText = (status: Status): string => {
    switch (status) {
      case Status.Todo:
        return "Todo";
      case Status.InProgress:
        return "In Progress";
      case Status.Done:
        return "Done";
      default:
        return "Unknown";
    }
  };

  return (
    <li style={{ 
      border: "1px solid #ddd", 
      borderRadius: 8, 
      padding: 10 
    }}>
      {editing ? (
        // Edit mode - show TaskForm for editing
        <TaskForm 
          initial={task} 
          onSaved={handleSaved} 
          onCancel={() => setEditing(false)} 
        />
      ) : (
        // View mode - display task information and action buttons
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: 8 
        }}>
          {/* Task information section */}
          <div>
            {/* Task title */}
            <strong>{task.title}</strong>
            
            {/* Status indicator with styling */}
            <div style={{ 
              fontSize: 12, 
              opacity: 0.8 
            }}>
              {getStatusText(task.status)}
            </div>
            
            {/* Optional description - only shown if present */}
            {task.description && (
              <p style={{ marginTop: 6 }}>
                {task.description}
              </p>
            )}
          </div>
          
          {/* Action buttons section */}
          <div style={{ 
            display: "flex", 
            gap: 8, 
            alignItems: "start" 
          }}>
            <button onClick={() => setEditing(true)}>
              Edit
            </button>
            <button onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Error message display for delete operations */}
      {err && (
        <small style={{ color: "crimson" }}>
          Error: {err}
        </small>
      )}
    </li>
  );
};

export default TaskItemRow;