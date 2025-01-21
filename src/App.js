import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PayrollManagement from './pages/Payroll/PayrollManagement';
import EmployeeList from './pages/Payroll/EmployeeList';
import PayrollGenerator from './pages/Payroll/PayrollGenerator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Other Public and Protected Routes */}
          {/* Payroll Module */}
          <Route
            path="/payroll/management"
            element={
              <ProtectedRoute>
                <PayrollManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/employeelist"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/generator"
            element={
              <ProtectedRoute>
                <PayrollGenerator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

console.log("PayrollManagement:", PayrollManagement);
console.log("EmployeeList:", EmployeeList);
console.log("PayrollGenerator:", PayrollGenerator);
console.log("ProtectedRoute:", ProtectedRoute);
export default App;
