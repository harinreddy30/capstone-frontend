import React from 'react';
import { useNavigate } from 'react-router-dom';  // For navigation in React Router v6+


const TopNavBar = ({ toggleSidebar }) => {

  const navigate = useNavigate();  // Access the navigate function for navigation

  const handleSettingsClick = () => {
    navigate('/profile/view');
  };

  const handleLogout = () => {
    // Clear the authentication token (if it's stored in localStorage or Redux)
    localStorage.removeItem('token');  // Assuming JWT token is stored in localStorage
    
    // Optionally, clear any user data from Redux or state here

    // Redirect to the login page after logging out
    navigate('/login');  // Redirect to '/login' route
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg mr-4 focus:outline-none"
        >
          ☰
        </button>
        <h2 className="text-xl font-semibold text-gray-800">SHIFTSMART</h2>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Search..."
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
      
        <button 
          onClick={handleSettingsClick}
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
        >
          ⚙️
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;
