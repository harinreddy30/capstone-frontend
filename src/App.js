import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Use to manage application State, token and yser data\

import Login from './pages/Auth/Login';

import EmployeeDashboard from './Dashboard/EmployeeDashboard/EmployeeDashboard'
import HRDashboard from './Dashboard/HRDashboard/HRDashboard'
import ManagerDashboard from './Dashboard/ManagerDashboard/ManagerDashboard'
import PayrollDashboard from './Dashboard/PayrollDashboard/PayrollDashboard'
import AdminDashboard from './Dashboard/AdminDashboard/AdminDashboard'

// A private route wrapper to protect routes based on authentication
// Implement RBAC to implement authentication and authorization
const ProtectedRoute = ({ children, authorizedRoles }) => {

  const { token , user } = useSelector((state) => state.auth) // auth is the name of the Slice that contains token and user
  console.log(user)
  console.log(token)


  if(!token){
    return <Navigate to='/login'/>
  }

  if(authorizedRoles && !authorizedRoles.includes(user.role)){
    return <Navigate to='/' /> // Redirect if the user doesnt have any roles
  }

  return children;

}

// const App = () => {

// }
function App() {

    // UseEffect is used to remove the token from localStorage, if the token is missing
    const { token } = useSelector((state) => state.auth);

    // Automaticaly logout if the token is missing
    useEffect(() => {
      if(!token){
        localStorage.removeItem("token");
      }
    }, [token]);

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} /> 

          {/* Protected Routes */}

          {/* Employee Protected Routes */}
          <Route 
            path="/employee/dashboard" 
            element = {
              <ProtectedRoute authorizedRoles={["Employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />

          {/* HR Protected Routes */}
          <Route 
            path="/HR/dashboard" 
            element = {
              <ProtectedRoute authorizedRoles={["HR"]}>
                <HRDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Manager Protected Routes */}
          <Route 
            path="/Manager/dashboard" 
            element = {
              <ProtectedRoute authorizedRoles={["Manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Payroll Protected Routes */}
          <Route 
            path="/Payroll/dashboard" 
            element = {
              <ProtectedRoute authorizedRoles={["PayrollManager"]}>
                <PayrollDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/Admin/dashboard" 
            element = {
              <ProtectedRoute authorizedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
          
        </Routes>
      </Router>
  );
}


export default App;
