import React from 'react';
import './TopNavBar.css'; 

const TopNavBar = () => {
  return (
    <div className="top-navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <button className="menu-button">☰</button> {/* Menu icon */}
        <h2 className="logo">SHIFTSMART</h2>
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search Anything" 
          />
          <button className="search-icon">🔍</button>
        </div>
      </div>

     
      <div className="navbar-right">
        <button className="icon-button">💬</button> {/* Chat Icon */}
        <button className="icon-button">🔔</button> {/* Notifications Icon */}
        <button className="icon-button">⚙️</button> {/* Settings Icon */}
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default TopNavBar;
