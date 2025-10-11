/**
 * TaskForm Component - Reusable form for creating and editing tasks
 * 
 * This component serves a dual purpose:
 * 1. Creating new tasks (when no initial data is provided)
 * 2. Editing existing tasks (when initial task data is provided)
 * 
 * Features:
 * - Form validation and error handling
 * - Loading states during API operations
 * - Automatic form reset after successful creation
 * - Trim whitespace from input values
 * - Convert empty descriptions to null for API consistency
 */

import { useState } from "react";
import { Status, updateTask, createTask } from "../api";
import type { TaskCreateDto, TaskItem } from "../api";

/**
 * Props interface for the TaskForm component
 */
type Props = {
  /** 
   * If provided, the form will be in "edit mode" and pre-populate with this task's data.
   * If null/undefined, the form will be in "create mode" for adding new tasks.
   */
  initial?: TaskItem | null;
  
  /** 
   * Callback function called when a task is successfully saved (created or updated).
   * Parent component uses this to update the task list optimistically.
   */
  onSaved: (saved: TaskItem) => void;
  
  /** 
   * Optional callback for canceling the form operation.
   * Typically used in edit mode to return to view mode.
   */
  onCancel?: () => void;
};

/**
 * Reusable form component for task creation and editing.
 * Handles both create and update operations based on whether initial data is provided.
 */
const TaskForm: React.FC<Props> = ({ initial = null, onSaved, onCancel }) => {
  // Form state management
  
  /** Task title - initialized from existing task or empty string for new tasks */
  const [title, setTitle] = useState(initial?.title ?? "");
  
  /** Task description - initialized from existing task or empty string for new tasks */
  const [description, setDescription] = useState(initial?.description ?? "");
  
  /** Task status - initialized from existing task or Todo for new tasks */
  const [status, setStatus] = useState<Status>(initial?.status ?? Status.Todo);
  
  /** Loading state to disable form and show feedback during API operations */
  const [saving, setSaving] = useState(false);
  
  /** Error state to display validation or API errors to the user */
  const [error, setError] = useState<string | null>(null);

  /**
   * Form submission handler that creates or updates tasks based on the presence of initial data.
   * Implements proper error handling, loading states, and form validation.
   * 
   * @param e - Form submission event
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null);     // Clear any previous errors
    setSaving(true);    // Enable loading state

    try {
      // Prepare cleaned data for API submission
      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim() || null; // Convert empty string to null

      if (initial) {
        // Update existing task
        await updateTask(initial.id, { 
          title: trimmedTitle, 
          description: trimmedDescription, 
          status 
        });
        
        // Notify parent with updated task data for optimistic UI update
        onSaved({ 
          ...initial, 
          title: trimmedTitle, 
          description: trimmedDescription, 
          status 
        });
      } else {
        // Create new task
        const created = await createTask({ 
          title: trimmedTitle, 
          description: trimmedDescription, 
          status 
        } as TaskCreateDto);
        
        // Notify parent with the created task (includes assigned ID)
        onSaved(created);
        
        // Reset form for next task creation
        setTitle("");
        setDescription("");
        setStatus(Status.Todo);
      }
    } catch (e: any) {
      // Display error message to user
      setError(e.message);
    } finally {
      // Always disable loading state, regardless of success or failure
      setSaving(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ display: "grid", gap: 8, marginBottom: 12 }}
    >
      {/* Title input - required field with character limit */}
      <input
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200} // Matches backend validation
        disabled={saving}
      />
      
      {/* Description textarea - optional field */}
      <textarea
        placeholder="Description (optional)"
        value={description ?? ""}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        disabled={saving}
      />
      
      {/* Status dropdown - shows all available status options */}
      <select 
        value={status} 
        onChange={(e) => setStatus(Number(e.target.value) as Status)}
        disabled={saving}
      >
        <option value={Status.Todo}>Todo</option>
        <option value={Status.InProgress}>In Progress</option>
        <option value={Status.Done}>Done</option>
      </select>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : (initial ? "Save" : "Add Task")}
        </button>
        
        {/* Cancel button - only shown when onCancel callback is provided */}
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>

      {/* Error message display */}
      {error && (
        <small style={{ color: "crimson" }}>
          Error: {error}
        </small>
      )}
    </form>
  );
};

export default TaskForm;