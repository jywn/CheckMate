import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import URL_LINK from "../../config"
import { RiDeleteBin6Line } from "react-icons/ri";

function TaskCard({ task }) {
  // const [reminder, setReminder] = useState(task.reminder || false); // Manage reminder state
  const [importance, setImportance] = useState(Number(task.importance) || 0);
  const [done, setDone] = useState(task.status === "DONE"); // Check if task is marked as done
  const [showDropdown, setShowDropdown] = useState(false); // Manage importance dropdown visibility
  const dropdownRef = useRef(null); // Ref to detect outside clicks for dropdown
  const [isEditing, setIsEditing] = useState({ title: false, description: false, time: false, people: false });
  const [isAddingSubTask, setIsAddingSubTask] = useState(false); // Toggle for sub-task input
  const [subTasks, setSubTasks] = useState(task.subTasks || []); // State for subtasks
  const [subTaskTitle, setSubTaskTitle] = useState(""); // State for sub-task input
  const [dateTime, setDateTime] = useState(task.date || ""); // Track the date and time input
  const [status, setStatus] = useState(task.status); // Track task status locally
  const [isLoading, setIsLoading] = useState(false); 
  const [files, setFiles] = useState([]); // State to store file names

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${URL_LINK}${task.task_id}/file/`);
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
  
        // Extract file names from the file path
        const parsedFiles = data.map((file) => ({
          id: file.file_id,
          name: file.file.split("/").pop(), // Extract the file name
          url: file.file, // Full URL for downloading or viewing
        }));
        setFiles(parsedFiles);
      } catch (error) {
        console.error("Error fetching files:", error.message);
      }
    };
  
    fetchFiles();
  }, [task.task_id]);
  
  
  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`${URL_LINK}${task.task_id}/file/${fileId}/`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
  
      console.log(`File with ID ${fileId} deleted successfully`);
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId)); // Update the state to remove the deleted file
    } catch (error) {
      console.error("Error deleting file:", error.message);
      alert(`Error deleting file: ${error.message}`);
    }
  };
  

  const reloadPage = () => {
    window.location.reload(); // Reload the page to fetch the latest data
  };

  const formattedTime = task.date
  ? new Date(task.date).toLocaleString([], {
      weekday: 'short', // Short name for the day of the week (e.g., "Tue")
      month: 'short',   // Short name for the month (e.g., "Dec")
      day: '2-digit',   // Two-digit day of the month (e.g., "10")
      hour: '2-digit',  // Two-digit hour (e.g., "10")
      minute: '2-digit',// Two-digit minute (e.g., "00")
      hour12: true,     // 12-hour format with AM/PM
      timeZone: 'UTC',  // Treat the input as UTC
    })
  : "No date/time"; // Default to "No date/time" if no time is provided

  // const handleReminderToggle = () => {
  //   setReminder((prev) => {
  //     const newReminder = !prev;
  
  //     fetch(`${URL_LINK}${ task.task_id}/`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ reminder: newReminder }),
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           return response.text().then((errorText) => {
  //             throw new Error(`Failed to update reminder: ${errorText || 'Unknown error'}`);
  //           });
  //         }
  //         console.log("Reminder updated successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Error updating reminder:", error.message);
  //       });
  
  //     return newReminder;
  //   });
  // };

  const handleImportanceToggle = () => { // Toggle visibility of importance dropdown
    setShowDropdown((prev) => !prev); // Toggle dropdown state
  };

  const handleStarClick = (level) => { // Set importance level and update backend
    setImportance(level); // Update local state
    setShowDropdown(false); // Close dropdown

    fetch(`${URL_LINK}${ task.task_id}/`, { // Backend API call
      method: "PATCH", // Use PATCH for importance update
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ importance: level }), // Send selected importance level
    })
      .then((response) => {
        if (!response.ok) { // Check for errors
          throw new Error("Failed to update importance");
        }
        console.log("Importance updated successfully"); // Log success
      })
      .catch((error) => {
        console.error("Error updating importance:", error); // Log error
      });
  };

  const handleClearImportance = () => { // Reset importance level
    setImportance(0); // Update local state
    setShowDropdown(false); // Close dropdown

    fetch(`${URL_LINK}${ task.task_id}/`, { // Backend API call
      method: "PATCH", // Use PATCH to reset importance
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ importance: null }), // Send reset value
    })
      .then((response) => {
        if (!response.ok) { // Check for errors
          throw new Error("Failed to reset importance");
        }
        console.log("Importance reset successfully"); // Log success
      })
      .catch((error) => {
        console.error("Error resetting importance:", error); // Log error
      });
  };


  

  const handleMarkAsDone = async () => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
  
    try {
      // Corrected URL formatting
      const response = await fetch(`${URL_LINK}${task.task_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "DONE" }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Fetch server error response
        throw new Error(`Failed to mark task as done: ${errorText}`);
      }
  
      console.log("Task marked as done successfully");
      setStatus("DONE"); // Update the local state
      reloadPage(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error marking task as done:", error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  

  const handleMarkAsWill = async () => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);

    try {
      const response = await fetch(`${URL_LINK}${task.task_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "WILL" }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark task as will");
      }

      console.log("Task marked as will successfully");
      setStatus("WILL"); // Update the local state
      reloadPage(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error marking task as will:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };


  

  useEffect(() => { // Detect clicks outside dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { // Check if click is outside
        setShowDropdown(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);


  const handleEdit = (field) => { // Enable editing mode for a specific field
    setIsEditing((prev) => ({ ...prev, [field]: true })); // Update editing state
  };

  const handleSave = async (field, value) => {
    try {
      let updatedValue = value;
  
      // Convert datetime-local to ISO 8601 format for date fields
      if (field === "date" && value) {
        const date = new Date(value);
        updatedValue = date.toISOString(); // Convert to ISO 8601 format
      }
  
      // Replace null or empty titles with "No title"
      if (field === "title" && (!value || value.trim() === "")) {
        updatedValue = "No title";
      }

      if (field === "people" && (!value || value.trim() === "")) {
        updatedValue = "Name not provided";
      }
  
      const response = await fetch(`${URL_LINK}${ task.task_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: updatedValue }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }
  
      console.log(`${field} updated successfully`);
  
      // Update state immediately for smooth UI updates
      if (field === "date") {
        setDateTime(updatedValue); // Update dateTime state
      } else if (field === "description") {
        task.description = updatedValue; // Directly update task description
      }else if (field === "people") {
        task.people = updatedValue;
      } 
      else if (field === "title") {
        task.title = updatedValue; // Update task title
      }
  
      setIsEditing((prev) => ({ ...prev, [field]: false })); // Exit editing mode
    } catch (error) {
      console.error(`Error updating ${field}:`, error.message);
    }
  };
  
  const handleKeyPress = (e, field, value) => { // Save on Enter key press
    if (e.key === "Enter") { // Check if Enter was pressed
      handleSave(field, value); // Save the field
    }
  };

  
  const handleAddSubTask = async () => {
    if (!subTaskTitle.trim()) {
      alert("Sub-task title cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch(`${URL_LINK}${task.task_id}/subtask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: subTaskTitle }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add sub-task: ${errorText}`);
      }
  
      const newSubTask = await response.json(); // Parse the response to get the created subtask
      setSubTasks((prev) => [...prev, newSubTask].sort((a, b) => a.subtask_id - b.subtask_id)); // Add and sort
      setSubTaskTitle(""); // Clear the input field
      setIsAddingSubTask(false); // Hide the input
    } catch (error) {
      console.error("Error adding sub-task:", error.message);
      alert(`Error adding sub-task: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchSubTasks = async () => {
      try {
        const response = await fetch(`${URL_LINK}${task.task_id}/subtask/`);
        if (!response.ok) {
          throw new Error("Failed to fetch subtasks");
        }
        const data = await response.json();
        // Sort subtasks by subtask_id
        const sortedSubTasks = data.sort((a, b) => a.subtask_id - b.subtask_id);
        setSubTasks(sortedSubTasks);
      } catch (error) {
        console.error("Error fetching subtasks:", error.message);
      }
    };
  
    fetchSubTasks();
  }, [task.task_id]);
  

  const handleDeleteSubTask = async (subtaskId) => {
    try {
      const response = await fetch(`${URL_LINK}${task.task_id}/subtask/${subtaskId}/`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete subtask");
      }
  
      // Remove the deleted subtask from the state
      setSubTasks((prev) => prev.filter((subTask) => subTask.subtask_id !== subtaskId));
      console.log("Subtask deleted successfully");
    } catch (error) {
      console.error("Error deleting subtask:", error.message);
    }
  };
  


  return (
    <div
    className={`task-card ${
      status === "DONE" ? "done" : status === "WILL" ? "will" : "to-do"
    }`}
  >
      {/* Editable Title */}
      <h3 onClick={() => handleEdit("title")}> {/* Enable editing on click */}
  {isEditing.title ? (
    <input
      type="text" // Text input for editing
      defaultValue={task.title || "No title"} // Show current title or "No title" if null
      onKeyPress={(e) => handleKeyPress(e, "title", e.target.value)} // Save on Enter
      onBlur={(e) => handleSave("title", e.target.value)} // Save on blur
      autoFocus // Autofocus input
    />
  ) : (
    task.title && task.title.trim() !== "" // Check if title is not empty or whitespace
      ? task.title // Show title if available
      : "No title" // Default text if null or empty
  )}
</h3>
      {/* Editable PEOPLE */}
      <p onClick={() => handleEdit("people")}> {/* Enable editing on click */}
        {isEditing.people ? (
          <textarea
            defaultValue={task.people || ""} // Default to an empty string when editing
            onKeyPress={(e) => handleKeyPress(e, "people", e.target.value)} // Save on Enter
            onBlur={(e) => handleSave("people", e.target.value)} // Save on blur
            autoFocus // Autofocus textarea
          />
        ) : (
          task.people && task.people.trim() !== "" // Check if people is not empty or whitespace
            ? `With: ${task.people}` // Show poeple if available
            : "No Names provided" // Default text if empty
        )}
      </p>

      {/* Editable Description */}
      <p onClick={() => handleEdit("description")}> {/* Enable editing on click */}
        {isEditing.description ? (
          <textarea
            defaultValue={task.description || ""} // Default to an empty string when editing
            onKeyPress={(e) => handleKeyPress(e, "description", e.target.value)} // Save on Enter
            onBlur={(e) => handleSave("description", e.target.value)} // Save on blur
            autoFocus // Autofocus textarea
          />
        ) : (
          task.description && task.description.trim() !== "" // Check if description is not empty or whitespace
            ? task.description // Show description if available
            : "No description provided" // Default text if empty
        )}
      </p>


      <p>{task.location && `Location: ${task.location}`}</p> {/* Show location if available */}

      <div className="task-tags"> {/* Tags container */}
{/* Editable Date and Time */}
<span className="tag datetime" onClick={() => handleEdit("time")}>
  {isEditing.time ? (
    <input
  type="datetime-local"
  defaultValue={
    task.date
      ? new Date(task.date).toISOString().slice(0, 16) // Convert existing date to "YYYY-MM-DDTHH:mm"
      : ""
  }
  onKeyPress={(e) => handleKeyPress(e, "date", e.target.value)} // Save on Enter
  onBlur={(e) => handleSave("date", e.target.value)} // Save on blur
  autoFocus
/>

  ) : (
    formattedTime // Show formatted date and time if not editing
  )}
</span>


        {/* Importance Dropdown */}
        <span className="tag importance" onClick={handleImportanceToggle} ref={dropdownRef}> {/* Toggle dropdown */}
          {importance > 0 ? "★".repeat(importance) : "importance"} {/* Show stars or default text */}
          {showDropdown && ( // Show dropdown if visible
            <div className="importance-dropdown">
              <span className="remove-icon" onClick={handleClearImportance}> {/* Clear importance */}
                ✖
              </span>
              {[1, 2, 3, 4, 5].map((level) => ( // Generate stars
                <span
                  key={level}
                  className="star"
                  onClick={() => handleStarClick(level)} // Set importance level
                  style={{ cursor: "pointer" }}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </span>

        {/* Reminder Toggle
        <span
          className={`tag reminder ${reminder ? "on" : ""}`} 
          onClick={handleReminderToggle}
        >
          Reminder {reminder ? "ON" : "OFF"} 
        </span> */}

{/* Done Button */}
{status === "DONE" ? (
        <button
          className="task-btn uncomplete-btn"
          onClick={handleMarkAsWill}
          disabled={isLoading} // Disable button during API call
        >
          Uncomplete
        </button>
      ) : (
        <button
          className="task-btn complete-btn"
          onClick={handleMarkAsDone}
          disabled={isLoading} // Disable button during API call
        >
          Complete
        </button>
)}


      </div>
        {/* Display Files */}
        {files.length > 0 && (
  <div className="files-container">
    <h4>Files</h4>
    <ul>
      {files.map((file) => (
        <li key={file.id}>
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            {file.name}
          </a>
          <span
            className="delete-file"
            onClick={() => handleDeleteFile(file.id)}
            style={{ cursor: "pointer", marginLeft: "10px" }}
          >
            <RiDeleteBin6Line className="delete-file" />
          </span>
        </li>
      ))}
    </ul>
  </div>
)}


      <div className="sub-dropdown-container">
            {/* Add Sub Task button */}
            {!isAddingSubTask && (
        <button
          className="sub-dropdown-button"
          onClick={() => setIsAddingSubTask(true)}
        >
          Add Sub Task
        </button>
      )}

<div className="subtasks-container">
{(subTasks.length > 0 || isAddingSubTask) && <h4>Subtasks</h4>}

<ul>
  {subTasks.map((subTask) => (
    <li key={subTask.subtask_id} className="subtask-item">
      <input
        type="checkbox"
        id={`subtask-${subTask.subtask_id}`}
        name={`subtask-${subTask.subtask_id}`}
      />
      <span
        className="delete-subtask"
        onClick={() => handleDeleteSubTask(subTask.subtask_id)} // Call delete function
        style={{  }}
      >
        <RiDeleteBin6Line className="delete-subicon"/>

      </span>
      <label htmlFor={`subtask-${subTask.subtask_id}`}>
        {subTask.title}
      </label>
    </li>
  ))}
</ul>

  {isAddingSubTask && (
    <div className="subtask-input">
      <input
        type="text"
        placeholder="Enter sub-task title"
        value={subTaskTitle}
        onChange={(e) => setSubTaskTitle(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleAddSubTask();
          }
        }}
        autoFocus
      />
    </div>
  )}
</div>

      </div>
    </div>
  );
}
TaskCard.propTypes = {
  task: PropTypes.shape({
    task_id: PropTypes.number.isRequired, // Task ID
    title: PropTypes.string.isRequired, // Task title
    description: PropTypes.string, // Task description
    time: PropTypes.string, // Task time
    importance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Task importance level
    location: PropTypes.string, // Task location
    status: PropTypes.string, // Task status
  }).isRequired,
};


export default TaskCard;