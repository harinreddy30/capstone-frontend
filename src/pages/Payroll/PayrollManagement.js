import React, { useState } from "react";

const PayrollManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const employees = [
    { id: 1, name: "John Doe", paid: "$3000", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", paid: "$2500", date: "2024-01-10" },
    // Example data
  ];

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payroll Management</h1>
      <input
        type="text"
        placeholder="Search Employee"
        className="border px-4 py-2 mb-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-4 py-2">ID</th>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Amount Paid</th>
            <th className="border border-gray-400 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td className="border border-gray-400 px-4 py-2">{employee.id}</td>
              <td className="border border-gray-400 px-4 py-2">{employee.name}</td>
              <td className="border border-gray-400 px-4 py-2">{employee.paid}</td>
              <td className="border border-gray-400 px-4 py-2">{employee.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollManagement;
