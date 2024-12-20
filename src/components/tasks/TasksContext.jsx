import React, { createContext, useState, useEffect, useContext } from "react";
import URL_LINK from "../../config";

// const URL_LINK = "https://6c3b-163-239-255-162.ngrok-free.app/task/";

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // Initialize the state for tasks
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(URL_LINK);
    
        // Log response details for debugging
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
    
        // Check if the response is JSON
        const contentType = response.headers.get("Content-Type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          const errorText = await response.text(); // Fetch error message if available
          throw new Error(`Invalid response: ${response.statusText || "Unknown error"} - ${errorText}`);
        }
    
        const tasks = await response.json();
        setTasks(tasks);
        console.log("Fetched tasks:", tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err); // Store error in state
      } finally {
        setLoading(false);
      }
    };
    

    fetchTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    console.log("Task added:", newTask);
  };

  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
    console.log(`Task with ID ${taskId} removed.`);
  };

  // Conditional rendering for error or loading
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
};
