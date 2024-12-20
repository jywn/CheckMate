import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TaskCard from "./TaskCard";
import URL_LINK from "../../config"

function TaskList({ tasks = [], onDeleteTask = () => {}, showAttachments = false }) {
  const [selectedTask, setSelectedTask] = useState(null); // To track which task is selected for a comment
  const [comment, setComment] = useState(""); // To store the comment input value
  const [taskComments, setTaskComments] = useState({}); // To store the comments for tasks
  const [taskAttachments, setTaskAttachments] = useState({}); // To track attachments for tasks
  const [localTasks, setLocalTasks] = useState(tasks); // Local state for tasks


  const fetchTaskAttachments = async (taskId) => {
    try {
      const response = await fetch(`${URL_LINK}${taskId}/file/`);
      if (!response.ok) {
        throw new Error("Failed to fetch attachments");
      }
      const files = await response.json();
      if (files.length > 0) {
        setTaskAttachments((prev) => ({ ...prev, [taskId]: true })); // Mark task as having files
      }
    } catch (error) {
      console.error("Error fetching attachments:", error.message);
    }
  };
  
  useEffect(() => {
    localTasks.forEach((task) => fetchTaskAttachments(task.task_id));
  }, [localTasks]);
  

  // Handle file attachment
  const handleAttachFile = async (taskId, file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch(`${URL_LINK}${taskId}/file/`, { // Correct endpoint
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to attach file: ${errorText}`);
      }
  
      console.log("File attached successfully");
      setTaskAttachments((prev) => ({ ...prev, [taskId]: true })); // Mark attachment as added
    } catch (error) {
      console.error("Error attaching file:", error.message);
      alert(`Error attaching file: ${error.message}`);
    }
  };
  

// Handle comment submission
const handleAddComment = async (taskId) => {
  try {
    const payload = { task_id: taskId, comment }; // Include task_id and comment in the payload
    const response = await fetch(`${URL_LINK}reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add comment");
    }

    const addedComment = await response.json(); // Get the newly added comment from the response
    console.log("Comment added successfully", addedComment);

    // Update the local state with the new comment
    setTaskComments((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), addedComment.comment],
    }));
    setComment("");
    setSelectedTask(null);
  } catch (error) {
    console.error("Error adding comment:", error);
    alert(`Error adding comment: ${error.message}`);
  }
};


  // Handle task deletion
  const handleDeleteTask = async (task_id) => {
    try {
      const response = await fetch(`${URL_LINK}${task_id}/`, { // Ensure the URL ends with a slash
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
      }
  
      console.log(`Task with id ${task_id} deleted successfully`);
      setLocalTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id)); // Remove task from local state
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert(`Error deleting task: ${error.message}`);
    }
  };

  return (
    <div className="task-list">
      {localTasks.length > 0 ? (
        localTasks.map((task) => (
          <div className="task-card-container" key={task.task_id}>
            <TaskCard task={task} />

            {/* Delete Button */}
            <div
              className="delete-button"
              onClick={() => handleDeleteTask(task.task_id)}
            >
              <span className="delete-icon">X</span>
            </div>

            {/* Attachment and Comment Icons */}
            {showAttachments && (
              <div className="task-icons">
                {/* Attachment Icon */}
                <div
  className={`icon attachment-icon ${
    taskAttachments[task.task_id] ? "active" : ""
  }`}
  title="Attach file"
  style={{
    color: taskAttachments[task.task_id] ? "#636ae8" : "inherit", // Apply color dynamically
    position: "relative", // Enable dropdown positioning
  }}
>
  <input
    type="file"
    style={{ display: "none" }}
    id={`attach-file-${task.task_id}`}
    onChange={(e) => {
      if (e.target.files[0]) {
        handleAttachFile(task.task_id, e.target.files[0]);
        fetchTaskAttachments(task.task_id); // Refresh attachment state after uploading
      }
    }}
  />
  <label htmlFor={`attach-file-${task.task_id}`}>
    <i className="fa-solid fa-paperclip"></i>
  </label>
</div>
                {/* Comment Icon */}
                <div
                  className={`icon comment-icon ${
                    taskComments[task.task_id] ? "active" : ""
                  }`}
                  title="Add comment"
                  onClick={() => setSelectedTask(task.task_id)}
                >
                  <i className="fa-regular fa-comment"></i>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}

      {/* Comment Input Modal */}
      {selectedTask && (
        <div className="comment-modal">
          <div className="comment-box">
            <h3>Add Comment</h3>
            <textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={() => handleAddComment(selectedTask)}>Submit</button>
            <button onClick={() => setSelectedTask(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      task_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      time: PropTypes.string,
      importance: PropTypes.oneOfType([
        PropTypes.string, // Accept both string
        PropTypes.number, // and number for flexibility
      ]),
      reminder: PropTypes.bool,
      status: PropTypes.string,
    })
  ).isRequired,
  onDeleteTask: PropTypes.func,
  showAttachments: PropTypes.bool,
};


export default TaskList;






