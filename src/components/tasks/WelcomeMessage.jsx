import React from "react";

function WelcomeMessage() {
  return (
    <div className="welcome-main-container">
      <section className="welcome-message">
        <p>
          Get ready to take productivity to the next level. Just type in a task
          description below, and our AI will help you transform it into a
          structured task.
        </p>
        <p>
          Need full control? Head over to the <strong>Tasks Page</strong> to
          customize or create tasks manually. Let's make planning effortless
          together!
        </p>
      </section>
      <section className="hints">
        <ul>
          <li>
            <strong>Starting with AI Assistance:</strong> Describe your task and
            our AI will organize it for you.
          </li>
          {/* Add other hints as needed */}
        </ul>
      </section>
    </div>
  );
}

export default WelcomeMessage;
