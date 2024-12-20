// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/pages/Navbar";
import Dashboard from "./components/Dashboard";
import TasksPage from "./components/TasksPage";
import Notes from "./components/Notes";
import Reviews from "./components/Reviews";
import { TasksProvider } from "./components/tasks/TasksContext";

function App() {
  return (
    <TasksProvider>
      <Router>
        <div className="app-layout">
          <div className="navigation-container">
            {" "}
            <Navbar />
          </div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/taskspage" element={<TasksPage />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/reviews" element={<Reviews />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TasksProvider>
  );
}

export default App;
