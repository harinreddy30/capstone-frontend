import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TopNavBar from '../../components/NavBar/TopNavBar';
import '../Dashboard.css';
// import { Dashboard } from '@mui/icons-material';

// Lazy load components to improve performance
const PayrollGenerator = React.lazy(() => import('../../pages/Payroll/PayrollGenerator'));
const PayrollManagement = React.lazy(() => import('../../pages/Payroll/PayrollManagement'));
const EmployeeList = React.lazy(() => import('../../pages/Payroll/EmployeeList'));
const Dashboard = React.lazy(() => import('../../pages/Payroll/Dashboard'));
const GeneratePayroll = React.lazy(() => import('../../pages/Payroll/GeneratePayrollPage'));
// const ChatGroup = React.lazy(() => import('../../components/ChatGroup/ChatGroup'));
// const GroupChatPage = React.lazy(() => import('../../components/ChatGroup/GroupChatPage'));

// Sidebar Component with consistent styling
const SideBar = ({ isCollapsed, isModalOpen }) => {
  // If modal is open, don't render the sidebar
  if (isModalOpen) return null;

  const navLinks = [
    { path: 'management', label: 'Management', icon: '💼' },
    { path: 'employee-list', label: 'Employee List', icon: '👥' },
    { path: 'generator', label: 'Payroll & History', icon: '💰' },
    { path: 'dashboard', label: 'Dashboard', icon: '💰' },

    // { path: 'chat-group', label: 'Chat Group', icon: '💬' },

  ];

  return (
    <div className={`left-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="flex items-center mb-6">
        {!isCollapsed && <span className="ml-3 font-semibold text-gray-800">Payroll Dashboard</span>}
      </div>
      
      <nav className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={`/payroll/${link.path}`}
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

const PayrollDashboard = () => {
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
                path="dashboard" 
                element={
                  <Dashboard 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route 
                path="management" 
                element={
                  <PayrollManagement 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route 
                path="employee-list" 
                element={
                  <EmployeeList 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route 
                path="generator" 
                element={
                  <PayrollGenerator 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
              <Route 
                path="generatePayroll" 
                element={
                  <GeneratePayroll 
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                  />
                } 
              />
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
