import React from 'react';
import LoginPage from './components/LoginPage/LoginPage';
import TopNavBar from './components/TopNavBar/TopNavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 

const App = () => {
  return (
    <Router>
      <div className="app">
        <TopNavBar />
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
