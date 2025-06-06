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

import ProfileEdit from './pages/Profile/ProfileEdit';
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfileView from "./pages/Profile/ProfileView";
// A private route wrapper to protect routes based on authentication
// Implement RBAC to implement authentication and authorization
const ProtectedRoute = ({ children, authorizedRoles }) => {

  // UsSelector takes the current state for updation
  const { token , user } = useSelector((state) => state.auth) // auth is the name of the Slice that contains token and user
  // console.log("Token in ProtectedRoute:", token);
  // console.log("User in ProtectedRoute:", user);

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

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} /> 

          <Route path='api/v1/users/reset-password/:token' element={<ResetPassword/>} />

          {/* Protected Routes */}

          {/* Profile Protected Routes */}
          <Route 
            path="/profile/view"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
          }
          />
          <Route 
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
          }
          />

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
