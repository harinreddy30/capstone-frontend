import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';

// Lazy load components to improve performance
const ManagerSites = React.lazy(() => import('../../pages/Manager/ManagerSites'));
// const AssignShift = React.lazy(() => import('../../pages/Manager/AssignShift'));
const ManagerReports = React.lazy(() => import('../../pages/Manager/ManagerReports'));
// const ViewAvailability = React.lazy(() => import('../../pages/Manager/ViewAvailability'));
const LeaveRequests = React.lazy(() => import('../../pages/Manager/LeaveRequests'));
// const ChatGroup = React.lazy(() => import('../../pages/Manager/ChatGroup'));

// Sidebar Component
const SideBar = () => {
  const navLinks = [
    { path: 'sites', label: 'My Sites' },
    { path: 'assign-shift', label: 'Assign Shift' },
    { path: 'Manager-reports', label: 'Manager Reports' },
    { path: 'view-availability', label: 'View Availability' },
    { path: 'leave-requests', label: 'Leave Requests' },
    { path: 'chat-group', label: 'Chat Group' },
  ];

  return (
    <div className="left-nav">
      <div className="header">
        <div className="user-info">
          <p>Manager</p>
          <p>manager@company.com</p>
        </div>
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link to={`/manager/${link.path}`}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ManagerDashboard = () => {
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
              <Route path="sites" element={<ManagerSites />} />
              <Route path="manager-reports" element={<ManagerReports />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              {/* <Route path="assign-shift" element={<AssignShift />} />
              <Route path="view-availability" element={<ViewAvailability />} />
              <Route path="chat-group" element={<ChatGroup />} /> */}
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
