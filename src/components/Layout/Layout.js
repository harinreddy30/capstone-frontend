import React from 'react';
import TopNavBar from '../NavBar/TopNavBar';

const Layout = ({ children }) => {
  return (
    <div>
      <TopNavBar />
      <main className="min-h-screen bg-gray-100 pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout; 