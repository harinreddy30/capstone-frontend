import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Use to manage application State, token and yser data\

import Login from './pages/Auth/Login';
import { setToken } from "./redux/slices/authSlice";

import EmployeeDashboard from './Dashboard/EmployeeDashboard/EmployeeDashboard'
import HRDashboard from './Dashboard/HRDashboard/HRDashboard'
import ManagerDashboard from './Dashboard/ManagerDashboard/ManagerDashboard'
import PayrollDashboard from './Dashboard/PayrollDashboard/PayrollDashboard'
import AdminDashboard from './Dashboard/AdminDashboard/AdminDashboard'

// A private route wrapper to protect routes based on authentication
// Implement RBAC to implement authentication and authorization
const ProtectedRoute = ({ children, authorizedRoles }) => {

  // UsSelector takes the current state for updation
  const { token , user } = useSelector((state) => state.auth) // auth is the name of the Slice that contains token and user
  console.log("Token in ProtectedRoute:", token);
  console.log("User in ProtectedRoute:", user);

  if(!token){
    return <Navigate to='/login'/>
  }
  // If the user is not loaded yet, you can either show a loading spinner or handle it gracefully.
  if (!user) {
    return <div>Loading...</div>; // or any placeholder while the user data is being fetched
  }

  if(authorizedRoles && !authorizedRoles.includes(user.role)){
    console.log(`Redirecting to home because user role "${user.role}" is unauthorized.`);
      return <Navigate to='/' /> // Redirect if the user doesnt have any roles
  }

  return children;

}

function App() {

  // const dispatch = useDispatch();

  // UseEffect is used to remove the token from localStorage, if the token is missing
  // const { token } = useSelector((state) => state.auth);

  // Restore the token from localStorage on page load/refresh
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   if (storedToken) {
  //     dispatch(setToken(storedToken)); // Set the token into Redux state if it exists in localStorage
  //   }
  // }, [dispatch]);

    // Automaticaly logout if the token is missing
    // useEffect(() => {
    //   if(!token){
    //     localStorage.removeItem("token");
    //   }
    // }, [token]);

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} /> 

          {/* Protected Routes */}

          {/* Employee Protected Routes */}
          <Route 
            path="/employee/*" 
            element={
                <ProtectedRoute authorizedRoles={["Employee"]}>
                    <EmployeeDashboard />
                </ProtectedRoute>
            } 
          />    

          {/* HR Protected Routes */}
          <Route 
            path="/HR/*" 
            element = {
              <ProtectedRoute authorizedRoles={["HR"]}>
                <HRDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Manager Protected Routes */}
          <Route 
            path="/Manager/*" 
            element = {
              <ProtectedRoute authorizedRoles={["Manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Payroll Protected Routes */}
          <Route 
            path="/Payroll/*" 
            element = {
              <ProtectedRoute authorizedRoles={["PayrollManager"]}>
                <PayrollDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/Admin/*" 
            element = {
              <ProtectedRoute authorizedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* R
          edirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
          
        </Routes>
      </Router>
  );
}


export default App;
