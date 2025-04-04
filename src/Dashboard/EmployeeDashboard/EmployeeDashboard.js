import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css'; 
import MyAvailability from '../../pages/Employee/MyAvailability';

// Lazy load components 
// This improves performance by loading components only when needed

const MySchedule = React.lazy(() => import('../../pages/Employee/MySchedule'));
const IncidentReports = React.lazy(() => import('../../pages/Employee/IncidentReport'));
const SwapShift = React.lazy(() => import('../../pages/Employee/SwapShift'));
const TimeOff = React.lazy(() => import('../../pages/Employee/TimeOff'));
const InputAvailability = React.lazy(() => import('../../pages/Employee/InputAvailability'));
const PayStubs = React.lazy(() => import('../../pages/Employee/PayStub'));
const ChatGroup = React.lazy(() => import('../../components/ChatGroup/ChatGroup'));
const GroupChatPage = React.lazy(() => import('../../components/ChatGroup/GroupChatPage'));


// Sidebar Components generate naviagation links dynamically
// Easier to add any links
const SideBar = ({ isCollapsed, isModalOpen }) => {
  // If modal is open, don't render the sidebar
  if (isModalOpen) return null;

  const navLinks = [
    { path: 'job-scheduling', label: 'My Schedule', icon: '📅' },
    { path: 'incident-reports', label: 'Incident Reports', icon: '📝' },
    { path: 'swap-shift', label: 'Swap Shift', icon: '🔄' },
    { path: 'time-off', label: 'Time Off', icon: '🌴' },
    // { path: 'input-availability', label: 'Input Availability', icon: '⏰' },
    { path: 'my-availability', label: 'My Availability', icon: '⏰' },
    { path: 'pay-stub', label: 'Pay Stubs', icon: '💰' },    
    { path: 'chat-group', label: 'Chat Group', icon: '💬' },

  ];

  return(
    <div className={`left-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="flex items-center mb-6">
        {!isCollapsed && <span className="ml-3 font-semibold text-gray-800">Employee Dashboard</span>}
      </div>
      
      <nav className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={`/employee/${link.path}`}
            onClick={() => console.log(`Navigating to /employee/${link.path}`)}  // Debugging navigation
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

const EmployeeDashboard = () => {
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
          {/*Suspense provide a fallback, while lazy-loaded components are fetched*/}
          <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route index element={<MySchedule />} />
              <Route path="job-scheduling" element={<MySchedule />} />
              <Route 
                path="incident-reports" 
                element={
                  <IncidentReports 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route path="swap-shift" element={<SwapShift />} />
              <Route path="time-off" element={<TimeOff />} />
              <Route path="input-availability" element={<InputAvailability />} />
              <Route path="my-availability" element={<MyAvailability />} />
              <Route path="pay-stub" element={<PayStubs />} />
              <Route path="chat-group" element={<ChatGroup />} /> 
              <Route path="chat-group/:groupId" element={<GroupChatPage />} />

            </Routes>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
