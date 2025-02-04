import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PayrollManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Mock data - replace with Redux state later
  const employees = [
    { id: "DM", name: "David Miller", cost: 1234.00, status: "Unpaid" },
    { id: "AB", name: "Alex Brown", cost: 1234.00, status: "Unpaid" },
    { id: "MJ", name: "Mary Johnson", cost: 1234.00, status: "Unpaid" },
    { id: "ED", name: "Emily Davis", cost: 1234.00, status: "Unpaid" },
    { id: "JD", name: "John Doe", cost: 1234.00, status: "Unpaid" },
    { id: "CW", name: "Chris Wilson", cost: 1234.00, status: "Unpaid" }
  ];

  const totalEmployerCost = "2478889.00";

  const handleDateChange = (e, dateType) => {
    if (dateType === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Payment</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e, 'start')}
            className="px-4 py-2 bg-black text-white border border-gray-700 rounded-lg"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(e, 'end')}
            className="px-4 py-2 bg-black text-white border border-gray-700 rounded-lg"
          />
        </div>
      </div>

      {/* Total Cost Card */}
      <div className="bg-black border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-gray-400 mb-2">Total Employer cost</h2>
        <p className="text-3xl font-bold">${totalEmployerCost}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Employee Table */}
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-400">
              <th className="p-4 text-left">UN</th>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Employee cost</th>
              <th className="p-4 text-left">Edit</th>
              <th className="p-4 text-left">Paid/Unpaid</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-800">
                <td className="p-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    {employee.id}
                  </div>
                </td>
                <td className="p-4">{employee.name}</td>
                <td className="p-4">${employee.cost.toFixed(2)}</td>
                <td className="p-4">
                  <button className="text-blue-400 hover:text-blue-300">
                    Review
                  </button>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm">
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Payroll Button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100">
          Generate Payroll
        </button>
      </div>
    </div>
  );
};

export default PayrollManagement;