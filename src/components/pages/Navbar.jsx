import React from "react";
import { NavLink } from "react-router-dom";
import navData from "../data/navData";

function Navbar() {
  console.log(navData);
  return (
    <nav>
      <div className="nav-main-container">
        <div>
          <h1>CheckMate</h1>
        </div>

        <div className="nav-links-container">
          {navData.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        <div className="nav-icons-container">
          <div className="icons-box">
            <a href="#">
              <i className="fa-solid fa-gear"></i>
            </a>
            <a href="#">
              <i className="fa-solid fa-user"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
