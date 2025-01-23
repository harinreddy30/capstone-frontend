import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css'; 

// Import your components for each section
// import JobScheduling from '../../components/Employee/JobScheduling';
// import IncidentReports from '../../components/Employee/IncidentReports';
// import SwapShift from '../../components/Employee/SwapShift';
// import TimeOff from '../../components/Employee/TimeOff';
// import InputAvailability from '../../components/Employee/InputAvailability/InputAvailability';
// import PayStubs from '../../components/Employee/PayStubs';

const EmployeeDashboard = () => {
  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <TopNavBar />

      <div className="dashboard-body">
        {/* Left Navigation */}
        <div className="left-nav">
          <div className="header">
            <div className="user-info">
              <p>Employee Username</p>
              <p>Employee@gmail.com</p>
            </div>
          </div>

          <ul className="nav-links">
            <li><Link to="/employee/job-scheduling">Job Scheduling</Link></li>
            <li><Link to="/employee/incident-reports">Incident Reports</Link></li>
            <li><Link to="/employee/swap-shift">Swap Shift</Link></li>
            <li><Link to="/employee/time-off">Time Off</Link></li>
            <li><Link to="/employee/input-availability">Input Availability</Link></li>
            <li><Link to="/employee/pay-stubs">Pay Stubs</Link></li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <Routes>
            {/* <Route path="job-scheduling" element={<JobScheduling />} />
            <Route path="incident-reports" element={<IncidentReports />} />
            <Route path="swap-shift" element={<SwapShift />} />
            <Route path="time-off" element={<TimeOff />} /> */}
            {/* <Route path="input-availability" element={<InputAvailability />} /> */}
            {/* <Route path="pay-stubs" element={<PayStubs />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
