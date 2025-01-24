import React from 'react';

const TopNavBar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-3" style={{ backgroundColor: '#0a0f2c', color: 'white' }}>
      {/* Left Section */}
      <div className="flex items-center">
        <button className="text-xl mr-4 text-white cursor-pointer focus:outline-none">
          ☰
        </button>
        <h2 className="text-2xl font-bold mr-6">SHIFTSMART</h2>
        <div className="flex items-center" style={{ backgroundColor: '#2d3651', borderRadius: '5px', padding: '5px 10px' }}>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white placeholder-gray-300 flex-grow"
            placeholder="Search Anything"
          />
          <button className="ml-2 text-white cursor-pointer focus:outline-none">
            🔍
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <button className="text-xl text-white cursor-pointer focus:outline-none">
          💬
        </button>
        <button className="text-xl text-white cursor-pointer focus:outline-none">
          🔔
        </button>
        <button className="text-xl text-white cursor-pointer focus:outline-none">
          ⚙️
        </button>
        <button className="text-sm font-medium text-white cursor-pointer focus:outline-none hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopNavBar;
