import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css'; 

// Lazy load components 
// This improves performance by loading components only when needed

const MySchedule = React.lazy(() => import('../../pages/Employee/MySchedule'));
const IncidentReports = React.lazy(() => import('../../pages/Employee/IncidentReport'));
const SwapShift = React.lazy(() => import('../../pages/Employee/SwapShift'));
const TimeOff = React.lazy(() => import('../../pages/Employee/TimeOff'));
const InputAvailability = React.lazy(() => import('../../pages/Employee/InputAvailability'));
const PayStubs = React.lazy(() => import('../../pages/Employee/PayStub'));

// Sidebar Components generate naviagation links dynamically
// Easier to add any links
const SideBar = () => {
  const navLinks = [
    { path: 'job-scheduling', label: 'My Schedule' },
    { path: 'incident-reports', label: 'Incident Reports' },
    { path: 'swap-shift', label: 'Swap Shift' },
    { path: 'time-off', label: 'Time Off' },
    { path: 'input-availability', label: 'Input Availability' },
    { path: 'pay-stub', label: 'Pay Stubs' },    
  ];

  return(

    <div className="left-nav">
      <div className="header">
        <div className="user-info">
          <p>Employee Username</p>
          <p>Employee@gmail.com</p>
        </div>
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link to={`/employee/${link.path}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

}

const EmployeeDashboard = () => {
  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <TopNavBar />

      <div className="dashboard-body">
        {/* Sidebar Navigation */}
        <SideBar />

        {/* Main Content Area */}
        <div className="main-content">

          {/*Suspense provide a fallback, while lazy-loaded components are fetched*/}
          <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="job-scheduling" element={<MySchedule />} />
              <Route path="incident-reports" element={<IncidentReports />} />
              <Route path="swap-shift" element={<SwapShift />} />
              <Route path="time-off" element={<TimeOff />} />
              <Route path="input-availability" element={<InputAvailability />} />
              <Route path="pay-stub" element={<PayStubs />} />
            </Routes>
          </React.Suspense>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
