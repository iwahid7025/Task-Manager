/**
 * Main Application Component for Task Manager
 * 
 * This is the root component that orchestrates the entire task management application.
 * It manages global state for tasks, handles data loading, and coordinates communication
 * between child components. The component implements optimistic UI updates for smooth
 * user experience.
 */

import { useEffect, useState } from "react";
import TaskForm from "./components/TaskFrom";
import TaskList from "./components/TaskList";
import TravelChat from './components/TravelChat';
import { getTasks, type TaskItem } from "./api";

/**
 * Root application component that serves as the main container for the task management system.
 * 
 * Features:
 * - Loads initial task data from the API on component mount
 * - Manages global application state (tasks, loading, error states)
 * - Provides callback handlers for child components to update state
 * - Implements error handling and loading states for better UX
 * - Uses optimistic updates to immediately reflect user actions
 */
const App: React.FC = () => {
  // State management for the entire application
  
  /** Array of all tasks loaded from the API */
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  
  /** Loading state to show spinner/message while data is being fetched */
  const [loading, setLoading] = useState(true);
  
  /** Error state to display any API or network errors to the user */
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect hook to load initial task data when the component mounts.
   * Runs only once due to empty dependency array.
   * Handles loading states and error conditions gracefully.
   */
  useEffect(() => {
    const load = async () => {
      try {
        // Fetch all tasks from the API
        const data = await getTasks();
        setTasks(data);
      } catch (e: any) {
        // Capture and display any errors that occur during loading
        setError(e.message);
      } finally {
        // Always stop loading state, regardless of success or failure
        setLoading(false);
      }
    };
    load();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Callback handler for when a new task is successfully created.
   * Implements optimistic UI update by immediately adding the new task to the list.
   * 
   * @param created - The newly created task item returned from the API
   */
  const handleCreated = (created: TaskItem) => 
    setTasks((prev) => [created, ...prev]); // Add new task to the beginning of the list

  /**
   * Callback handler for when an existing task is successfully updated.
   * Implements optimistic UI update by immediately updating the task in the list.
   * 
   * @param updated - The updated task item with new values
   */
  const handleUpdated = (updated: TaskItem) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  /**
   * Callback handler for when a task is successfully deleted.
   * Implements optimistic UI update by immediately removing the task from the list.
   * 
   * @param id - The ID of the task that was deleted
   */
  const handleDeleted = (id: number) => 
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui" }}>
      {/* Application header */}
      <h1>Task Manager</h1>

      {/* Task creation form - always visible at the top */}
      <TaskForm onSaved={handleCreated} />

      {/* Error display - only shown when there's an error */}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      
      {/* Conditional rendering based on loading state */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <TaskList 
          items={tasks} 
          onUpdated={handleUpdated} 
          onDeleted={handleDeleted} 
        />
      )}
    </div>
  );
};

export default App;