import React from "react"
function TaskAttachment({ task, handleAttachFile }) {
    const [showDropdown, setShowDropdown] = useState(false);
  
    const handleHover = () => {
      setShowDropdown(true); // Show the dropdown
      // Hide the dropdown after 3 seconds
      setTimeout(() => {
        setShowDropdown(false);
      }, 3000);
    };
  
    return (
      <div
        className={`icon attachment-icon ${task.hasAttachment ? "active" : ""}`}
        title="Attach file"
        style={{
          color: task.hasAttachment ? "#636ae8" : "inherit", // Apply color dynamically
          position: "relative",
        }}
        onMouseEnter={handleHover} // Show dropdown on hover
      >
        <input
          type="file"
          style={{ display: "none" }}
          id={`attach-file-${task.task_id}`}
          onChange={(e) => {
            if (e.target.files[0]) {
              handleAttachFile(task.task_id, e.target.files[0]);
            }
          }}
        />
        <label htmlFor={`attach-file-${task.task_id}`}>
          <i className="fa-solid fa-paperclip"></i>
        </label>
  
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="attachment-dropdown">
            <span
              className="dropdown-button"
              onClick={() => console.log("Button A clicked")}
            >
              A
            </span>
            <span
              className="dropdown-button"
              onClick={() => console.log("Button B clicked")}
            >
              B
            </span>
          </div>
        )}
      </div>
    );
  }
  
  TaskAttachment.propTypes = {
    task: PropTypes.shape({
      task_id: PropTypes.number.isRequired,
      hasAttachment: PropTypes.bool, // Ensure `hasAttachment` is provided
    }).isRequired,
    handleAttachFile: PropTypes.func.isRequired,
  };
  

  export default TaskAttachment;