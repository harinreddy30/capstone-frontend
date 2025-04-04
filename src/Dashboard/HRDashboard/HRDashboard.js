import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';

// Lazy load components to improve performance
const UserManagement = React.lazy(() => import('../../pages/HR/UserManagement'));
const SiteManagement = React.lazy(() => import('../../pages/HR/SiteManagement'));
const ChatGroup = React.lazy(() => import('../../components/ChatGroup/ChatGroup'));
const GroupChatPage = React.lazy(() => import('../../components/ChatGroup/GroupChatPage'));
// const Payroll = React.lazy(() => import('../../pages/HR/Payroll'));
// const Reports = React.lazy(() => import('../../pages/HR/Reports'));
// const Approvals = React.lazy(() => import('../../pages/HR/Approvals'));
// const Settings = React.lazy(() => import('../../pages/HR/Settings'));

// Sidebar Component
const SideBar = ({ isCollapsed, isModalOpen }) => {
  // If modal is open, don't render the sidebar
  if (isModalOpen) return null;

  const navLinks = [
    { path: 'user-management', label: 'User Management', icon: '👥' },
    { path: 'site-management', label: 'Site Management', icon: '🏢' },
    { path: 'chat-group', label: 'Chat Group', icon: '💬' },

  ];

  return (
    <div className={`left-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="flex items-center mb-6">
        {/* <img src="/logo.png" alt="Logo" className="h-8 w-8" /> */}
        {!isCollapsed && <span className="ml-3 font-semibold text-gray-800">HR Dashboard</span>}
      </div>
      
      <nav className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={`/hr/${link.path}`}
            className="flex items-center mb-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
          >
            <span className="text-xl w-8">{link.icon}</span>
            {!isCollapsed && <span className="ml-3">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const HRDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state

  const toggleSidebar = () => {
    if (!isModalOpen) { // Only toggle if modal is not open
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Modal handlers
  const handleModalOpen = () => {
    setIsModalOpen(true);
    setIsSidebarCollapsed(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsSidebarCollapsed(false);
  };

  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <TopNavBar 
        toggleSidebar={toggleSidebar}
        isModalOpen={isModalOpen}
      />

      <div className="dashboard-body">
        {/* Overlay for mobile */}
        <div 
          className={`overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Navigation */}
        <SideBar 
          isCollapsed={isSidebarCollapsed}
          isModalOpen={isModalOpen}
        />

        {/* Main Content Area */}
        <div className={`main-content ${isModalOpen ? 'modal-open' : ''}`}>
        <React.Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route 
              index 
              element={
                <UserManagement 
                  onModalOpen={handleModalOpen}
                  onModalClose={handleModalClose}
                />
              } 
            />
            <Route 
              path="user-management" 
              element={
                <UserManagement 
                  onModalOpen={handleModalOpen}
                  onModalClose={handleModalClose}
                />
              } 
            />
            <Route 
              path="site-management" 
              element={
                <SiteManagement 
                  onModalOpen={handleModalOpen}
                  onModalClose={handleModalClose}
                />
              } 
            />
            <Route path="chat-group" element={<ChatGroup />} /> 
            <Route path="chat-group/:groupId" element={<GroupChatPage />} />
          </Routes>
        </React.Suspense>

        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
