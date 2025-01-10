import React from 'react';
import './LeftNavbarEmployee.css'; // Ensure you create a CSS file for styles
import { Link } from 'react-router-dom';

const LeftNavbarEmployee = () => {
  return (
    <div className="employee-nav">
      {/* Header Section */}
      <div className="employee-header">
        <div className="user-info">
          <p>Username</p>
          <p>abc@gmail.com</p>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/job-scheduling">Job Scheduling</Link></li>
        <li><Link to="/incident-reports">Incident Reports</Link></li>
        <li><Link to="/swap-shift">Swap Shift</Link></li>
        <li><Link to="/time-off">Time Off</Link></li>
        <li><Link to="/input-availability">Input Availability</Link></li>
        <li><Link to="/pay-stubs">Pay Stubs</Link></li>
      </ul>
    </div>
  );
};

export default LeftNavbarEmployee;
