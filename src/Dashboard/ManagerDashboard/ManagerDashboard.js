import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';

// Lazy load components to improve performance
const ManagerSites = React.lazy(() => import('../../pages/Manager/ManagerSites'));
const AssignShift = React.lazy(() => import('../../pages/Manager/AssignShift'));
const ManagerReports = React.lazy(() => import('../../pages/Manager/ManagerReports'));
const ViewAvailability = React.lazy(() => import('../../pages/Manager/ViewAvailability'));
const LeaveRequests = React.lazy(() => import('../../pages/Manager/LeaveRequests'));
const ChatGroup = React.lazy(() => import('../../components/ChatGroup/ChatGroup'));
const GroupChatPage = React.lazy(() => import('../../components/ChatGroup/GroupChatPage'));
const CreateGroup = React.lazy(() => import('../../pages/Manager/CreateGroup'));
const AddMember = React.lazy(() => import('../../pages/Manager/AddMembersToGroup'));



// Sidebar Component
const SideBar = ({ isCollapsed, isModalOpen }) => {
  // If modal is open, don't render the sidebar
  if (isModalOpen) return null;

  const navLinks = [
    { path: 'sites', label: 'My Sites', icon: '🏢' },
    { path: 'assign-shift', label: 'Assign Shift', icon: '📅' },
    { path: 'manager-reports', label: 'Manager Reports', icon: '📊' },
    { path: 'view-availability', label: 'View Availability', icon: '👥' },
    { path: 'leave-requests', label: 'Leave Requests', icon: '✉️' },
    { path: 'chat-group', label: 'Chat Group', icon: '💬' },
    { path: 'create-group', label: 'Create Group', icon: '💬' },

  ];

  return (
    <div className={`left-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="flex items-center mb-6">
        {!isCollapsed && <span className="ml-3 font-semibold text-gray-800">Manager Dashboard</span>}
      </div>
      
      <nav className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={`/manager/${link.path}`}
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

const ManagerDashboard = () => {
  // Add state management for sidebar and modal
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    if (!isModalOpen) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

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
                path="sites" 
                element={
                  <ManagerSites 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route 
                path="manager-reports" 
                element={
                  <ManagerReports 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="create-group" element={<CreateGroup />} />
              <Route path="chat-group" element={<ChatGroup />} /> 
              <Route path="chat-group/:groupId" element={<GroupChatPage />} />
              <Route path="assign-shift" element={<AssignShift />} />
              <Route path="group-info/:groupId" element={<AddMember />} /> 
              <Route path="view-availability" element={<ViewAvailability />} />



              {/*  
              <Route path="chat-group" element={<ChatGroup />} /> */}
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
