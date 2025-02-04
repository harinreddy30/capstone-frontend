import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';

// Import your payroll pages
import PayrollGenerator from '../../pages/Payroll/PayrollGenerator';
import PayrollManagement from '../../pages/Payroll/PayrollManagement';
import EmployeeList from '../../pages/Payroll/EmployeeList';

const PayrollDashboard = () => {
  return (
    <div className="dashboard">
      <TopNavBar />

      <div className="dashboard-body">
        {/* Left Navigation */}
        <div className="left-nav">
          <div className="header">
            <div className="user-info">
              <p>Payroll Username</p>
              <p>Payroll@gmail.com</p>
            </div>
          </div>

          <ul className="nav-links">
            <li><Link to="/payroll/management">Management</Link></li>
            <li><Link to="/payroll/employee-list">Employee List</Link></li>
            <li><Link to="/payroll/generator">Payroll & History</Link></li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<PayrollGenerator />} />
            <Route path="/management" element={<PayrollManagement />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/generator" element={<PayrollGenerator />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
