import React from 'react';
import './LeftNavbarHr.css'; // Ensure to create a CSS file for HR styles
import { Link } from 'react-router-dom';

const LeftNavbarHR = () => {
  return (
    <div className="hr-nav">
      {/* Header Section */}
      <div className="hr-header">
        <div className="user-info">
          <p>Username</p>
          <p>abc@gmail.com</p>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/select-site">Select Site</Link></li>
        <li><Link to="/directory">Directory</Link></li>
        <li><Link to="/assign-manager">Assign Manager</Link></li>
        <li><Link to="/role-management">Role Management</Link></li>
        <li><Link to="/user-roles">User Roles</Link></li>
        <li><Link to="/chat-group">Chat Group</Link></li>
      </ul>
    </div>
  );
};

export default LeftNavbarHR;
