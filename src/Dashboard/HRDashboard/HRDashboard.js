import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';

// Lazy load components to improve performance
const UserManagement = React.lazy(() => import('../../pages/HR/UserManagement'));
const SiteManagement = React.lazy(() => import('../../pages/HR/SiteManagement'));
// const Payroll = React.lazy(() => import('../../pages/HR/Payroll'));
// const Reports = React.lazy(() => import('../../pages/HR/Reports'));
// const Approvals = React.lazy(() => import('../../pages/HR/Approvals'));
// const Settings = React.lazy(() => import('../../pages/HR/Settings'));

// Sidebar Component
const SideBar = () => {
  const navLinks = [
    { path: 'user-management', label: 'User Management' },
    { path: 'site-management', label: 'Site Management' },

    // { path: 'attendance-tracking', label: 'Attendance Tracking' },
    // { path: 'payroll', label: 'Payroll' },
    // { path: 'reports', label: 'Reports' },
    // { path: 'approvals', label: 'Approvals' },
    // { path: 'settings', label: 'Settings' },
  ];

  return (
    <div className="left-nav">
      <div className="header">
        <div className="user-info">
          <p>HR Manager</p>
          <p>hr.manager@company.com</p>
        </div>
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link to={`/hr/${link.path}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HRDashboard = () => {
  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <TopNavBar />

      <div className="dashboard-body">
        {/* Sidebar Navigation */}
        <SideBar />

        {/* Main Content Area */}
        <div className="main-content">
          <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="user-management" element={<UserManagement />} />
              <Route path="site-management" element={<SiteManagement />} />

              {/* <Route path="attendance-tracking" element={<AttendanceTracking />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="reports" element={<Reports />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="settings" element={<Settings />} /> */}
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
