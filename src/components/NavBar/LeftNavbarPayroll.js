import React from "react";
import { Link } from "react-router-dom";
import "./LeftNavbarPayroll.css";

const PayrollNavbar = () => {
  return (
    <div className="payroll-container">
      {/* Sidebar Section */}
      <div className="payroll-sidebar">
        <div className="user-profile">
          <i className="fas fa-user-circle profile-icon"></i>
          <p>Username</p>
          <p>abc@gmail.com</p>
        </div>
        <nav className="payroll-nav-links">
          <Link to="/home" className="nav-link">
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/management" className="nav-link">
            <i className="fas fa-user-cog"></i> Management
          </Link>
          <Link to="/employee-list" className="nav-link">
            <i className="fas fa-list"></i> Employee List
          </Link>
          <Link to="/payroll-history" className="nav-link active">
            <i className="fas fa-dollar-sign"></i> Payroll & History
          </Link>
        </nav>
      </div>

      {/* Main Content Section */}
      <div className="payroll-main-content">
        <h2>Welcome Back, Payroll Manager</h2>
        {/* Add Payroll-specific content here */}
      </div>
    </div>
  );
};

export default PayrollNavbar;
