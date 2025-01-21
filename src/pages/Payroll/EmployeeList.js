import React, { useState } from "react";

const EmployeeList = () => {
  const [roleFilter, setRoleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const employees = [
    { id: 1, name: "John Doe", role: "Manager", location: "New York" },
    { id: 2, name: "Jane Smith", role: "Employee", location: "Chicago" },
    // Example data
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      (!roleFilter || employee.role === roleFilter) &&
      (!locationFilter || employee.location === locationFilter)
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employee List</h1>
      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-4 py-2"
        >
          <option value="">Select Role</option>
          <option value="Manager">Manager</option>
          <option value="Employee">Employee</option>
        </select>
        <select
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border px-4 py-2"
        >
          <option value="">Select Location</option>
          <option value="New York">New York</option>
          <option value="Chicago">Chicago</option>
        </select>
      </div>
      <ul>
        {filteredEmployees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - {employee.role} ({employee.location})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
