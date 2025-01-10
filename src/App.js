import React from 'react';
import TopNavBar from './components/NavBar/TopNavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeftNavbarEmployee from './components/NavBar/LeftNavbarEmployee';
// import 

const App = () => {
  return (
    <Router>
      <div className="app">
        <TopNavBar />
        <LeftNavbarEmployee/>
        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import TopNavBar from './components/NavBar/TopNavBar';
// // import LeftNavbarManager from './components/Navbar/LeftNavbarManager';
// import LeftNavbarEmployee from './components/Navbar/LeftNavbarEmployee';
// // import LeftNavbarPayrollManager from './components/Navbar/LeftNavbarPayrollManager';
// // import LeftNavbarHR from './components/Navbar/LeftNavbarHR';
// import MainLayout from './components/Layout/MainLayout';
// import Dashboard from './pages/Dashboard';
// import EmployeeManagement from './pages/EmployeeManagement';
// import PayrollProcessing from './pages/PayrollProcessing';
// import HRDashboard from './pages/HRDashboard';
// import { getUserRole } from './utils/auth'; // Utility to get user role

// // Create Context for User Authentication and Role
// const UserContext = createContext();

// const App = () => {
//   const [userRole, setUserRole] = useState(null); // State for storing user role

//   // Get user role (this could be from localStorage, API call, etc.)
//   useEffect(() => {
//     const role = getUserRole(); // Fetch role from an API or localStorage
//     setUserRole(role);
//   }, []);

//   if (!userRole) {
//     return <div>Loading...</div>; // Show loading state while fetching the role
//   }

//   return (
//     <Router>
//       <UserContext.Provider value={{ userRole, setUserRole }}>
//         <div>
          
//           <TopNavbar />
//           <div className="layout-container">
//             <div className="left-navbar">
//               {userRole === 'MANAGER' && <LeftNavbarManager />}
//               {userRole === 'EMPLOYEE' && <LeftNavbarEmployee />}
//               {userRole === 'PAYROLL_MANAGER' && <LeftNavbarPayrollManager />}
//               {userRole === 'HR' && <LeftNavbarHR />}
//             </div>
//             <div className="main-content">
//               <Switch>
//                 <Route path="/dashboard" component={Dashboard} />
//                 <Route path="/employee-management" render={() => userRole === 'HR' || userRole === 'MANAGER' ? <EmployeeManagement /> : <Redirect to="/dashboard" />} />
//                 <Route path="/payroll-processing" render={() => userRole === 'PAYROLL_MANAGER' ? <PayrollProcessing /> : <Redirect to="/dashboard" />} />
//                 <Route path="/hr-dashboard" render={() => userRole === 'HR' ? <HRDashboard /> : <Redirect to="/dashboard" />} />
//                 <Redirect from="/" to="/dashboard" />
//               </Switch>
//             </div>
//           </div>
//         </div>
//       </UserContext.Provider>
//     </Router>
//   );
// };

// export default App;
