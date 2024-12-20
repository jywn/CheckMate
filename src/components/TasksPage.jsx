import React, { useState } from "react";
import { useTasks } from "./tasks/TasksContext";
import TaskList from "./tasks/TaskList";
import URL_LINK from "../config";

function TasksPage() {
  const { tasks, addTask, removeTask } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    time: "",
    importance: 0,
    // reminder: false,
  });

  const handleSaveTask = async () => {
    try {
      // Format the time in ISO 8601 format (T11:54:00Z)
      const formattedTime = newTask.time
        ? `T${newTask.time}:00Z`
        : "No time provided";

      // Combine all inputs into a single string
      const inputString = `${newTask.title || "Untitled Task"}, ${
        newTask.description || "No description"
      }, ${formattedTime}, importance ${newTask.importance || 0}, 
      Reminder ${
        newTask.reminder ? "ON" : "OFF"
      }`.trim();

      // Prepare the payload
      const payload = {
        input_string: inputString, // Single combined string
        gpt: "yes", // Add gpt key
      };

      // Send the data to the backend
      const response = await fetch(URL_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to save the task");
      }

      const savedTask = await response.json();
      addTask(savedTask);

      // Reset the task input form
      setIsAdding(false);
      setNewTask({
        title: "",
        description: "",
        time: "",
        importance: 0,
        // reminder: false,
      });
    } catch (error) {
      console.error("Error saving the task:", error);
    }
  };

  // const toggleReminder = () => {
  //   setNewTask((prev) => ({
  //     ...prev,
  //     reminder: !prev.reminder,
  //   }));
  // };

  const setImportance = (level) => {
    setNewTask((prev) => ({
      ...prev,
      importance: level,
    }));
  };

  // Filter tasks for the To Do section (exclude DONE)
  const todoTasks = tasks
  .filter((task) => task.status !== "DONE")
  .sort((a, b) => b.importance - a.importance);

  // Filter tasks for the Reviews section (exclude WILL)
const reviewTasks = tasks
  .filter((task) => task.status !== "WILL")
  .sort((a, b) => b.importance - a.importance);
  return (
    <div className="tasks-page">
      <div className="tasks-page-content">
        <div className="tasks-main-container">
          <div className="tasks-header-container">
            <h1>To Do</h1>
            <button className="add-task-button" onClick={() => setIsAdding(true)}>
              Add Task
            </button>
          </div>

          {/* Show the task creation template if `isAdding` is true */}
          {isAdding && (
            <div className="new-task-container">
              <div className="task-card new-task-card">
                <input
                  type="text"
                  placeholder="Enter title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Enter description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <input
                  type="time"
                  placeholder="Enter time"
                  value={newTask.time}
                  onChange={(e) =>
                    setNewTask({ ...newTask, time: e.target.value })
                  }
                />
                <div className="task-tags">
                  {/* Importance and Reminder Buttons */}
                  <span
                    className="tag importance"
                    onClick={() =>
                      setImportance(
                        newTask.importance < 5 ? newTask.importance + 1 : 0
                      )
                    }
                  >
                    {newTask.importance > 0
                      ? `Importance ${newTask.importance}`
                      : "Set Importance"}
                  </span>

                  {/* <span
                    className={`tag reminder ${newTask.reminder ? "on" : ""}`}
                    onClick={toggleReminder}
                  >
                    Reminder {newTask.reminder ? "ON" : "OFF"}
                  </span> */}
                </div>

                <div className="task-actions">
                  <button onClick={handleSaveTask}>Save</button>
                  <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* TaskList container for To Do tasks */}
          <TaskList tasks={todoTasks} onDeleteTask={removeTask} showAttachments={true} />
        </div>

        {/* Reviews Section */}
        <div className="reviews-container">
          <h1>Reviews</h1>
          <TaskList tasks={reviewTasks} onDeleteTask={removeTask} showAttachments={true} />
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
