import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PayrollManagement from './pages/Payroll/PayrollManagement';
import EmployeeList from './pages/Payroll/EmployeeList';
import PayrollGenerator from './pages/Payroll/PayrollGenerator';

function App() {
  return (
      <Router>
        <Routes>
          {/* Other Public and Protected Routes */}
          {/* Payroll Module */}
          <Route
            path="/payroll/management"
            element={
                <PayrollManagement />
            }
          />
          <Route
            path="/payroll/employeelist"
            element={
                <EmployeeList />
            }
          />
          <Route
            path="/payroll/generator"
            element={
                <PayrollGenerator />
            }
          />
        </Routes>
      </Router>
  );
}

console.log("PayrollManagement:", PayrollManagement);
console.log("EmployeeList:", EmployeeList);
console.log("PayrollGenerator:", PayrollGenerator);
export default App;
