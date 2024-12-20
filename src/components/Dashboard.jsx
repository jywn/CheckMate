import React, { useState, useEffect } from "react";
import TaskList from "./tasks/TaskList";
import WelcomeMessage from "./tasks/WelcomeMessage";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import URL_LINK from "../config";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [isNewUser, setIsNewUser] = useState(
    () => !localStorage.getItem("hasCreatedTask")
  );
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(URL_LINK)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return (
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  // Convert importance to string before passing to TaskList
  const recentTasks = data
  .filter((task) => task.status !== "DONE")
  .sort((a, b) => b.task_id - a.task_id) // Sort by task_id from greatest to lowest
  .slice(0, 4) // Take the top 4 tasks after sorting
  .map((task) => ({
    ...task,
    importance: task.importance.toString(), // Convert importance to string
  }));


  const todayTasks = data
    .filter(
      (task) => task.date && task.date.startsWith(today) && task.status !== "DONE"
    )
    .map((task) => ({
      ...task,
      importance: task.importance.toString(), // Convert importance to string
      formattedTime: task.date
        ? new Date(task.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // 12-hour format with AM/PM
            timeZone: 'UTC',  // Treat the input as UTC

          })
        : "No Time", // Default to "No Time" if time is not available
    }));

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTask = () => {
    if (!input.trim()) {
      alert("Please enter a valid task.");
      return;
    }
  
    // Send the input string to the backend
    sendInputToBackend(input);
  
    setInput(""); // Clear the input field after sending
  };
  
  const sendInputToBackend = async (inputString) => {
    try {
      // Prepare the payload in the required format
      const payload = {
        input_string: inputString, // Pass the input message
        gpt: "yes",               // Add the gpt key
      };
  
      const response = await fetch(URL_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send task to backend: ${errorText}`);
      }
  
      console.log("Task added successfully!");
      window.location.reload(); // Reload to reflect the new task
    } catch (error) {
      console.error("Error sending task to backend:", error);
    }
  };
  
  return (
    <div className="dashboard-container">
      <h1>Welcome to Your AI-powered Task Manager, User! 🎉</h1>

      {/* Show welcome message if the user is new */}
      {data.length === 0 && <WelcomeMessage />}

      {/* Input container for task entry */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your task (e.g., Task Title, Description)"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          {/* Display recent tasks */}
          <h2>Recent Tasks</h2>
          <TaskList tasks={recentTasks} />
        </div>

        {/* Calendar container */}
        <div className="dashboard-right">
          <div className="calendar-container">
            <Calendar value={new Date()} />
            {/* Today's Tasks */}
            <div className="today-tasks">
              <h3>Tasks for Today</h3>
              {todayTasks.length > 0 ? (
                <ul>
                  {todayTasks.map((task) => (
                    <li key={task.task_id}>
                      <span>{task.title}</span> -{" "}
                      <span>{task.formattedTime || "No Time"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks for today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
