import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css'; 


const HRDashboard = () => {
  return (
    <div className="dashboard">
      <TopNavBar />

      <div className="dashboard-body">
        {/* Left Navigation */}
        <div className="left-nav">
          <div className="header">
            <div className="user-info">
              <p>HR Username</p>
              <p>HR@gmail.com</p>
            </div>
          </div>

          <ul className="nav-links">
            <li><Link to="/HR/job-scheduling">Sites</Link></li>
            <li><Link to="/HR/incident-reports">Employees</Link></li>
            <li><Link to="/HR/swap-shift">RoleManagement</Link></li>
            <li><Link to="/HR/swap-shift">Assign Manager</Link></li>
            <li><Link to="/HR/time-off">User Roles</Link></li>
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

export default HRDashboard;
