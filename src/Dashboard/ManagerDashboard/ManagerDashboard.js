import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css'; 


const ManagerDashboard = () => {
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
            <li><Link to="/HR/job-scheduling">View Schedule</Link></li>
            <li><Link to="/HR/incident-reports">Assign Shift</Link></li>
            <li><Link to="/HR/swap-shift">Employee Reports</Link></li>
            <li><Link to="/HR/swap-shift">View Availability</Link></li>
            <li><Link to="/HR/time-off">Leave Requests</Link></li>
            <li><Link to="/HR/input-availability">Chat Group</Link></li>
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

export default ManagerDashboard;
