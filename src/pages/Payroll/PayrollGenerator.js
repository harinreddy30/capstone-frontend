import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PayrollGenerator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Mock data - replace with actual Redux state later
  const payrollData = {
    totalEmployees: 123,
    totalPayroll: 24788.89,
    ytdPayroll: 567234.89,
    employees: [
      { 
        id: "DM", 
        name: "David Miller", 
        cost: 1234.00, 
        status: "Pending" 
      },
      { 
        id: "AB", 
        name: "Alex Brown", 
        cost: 1234.00, 
        status: "Paid" 
      },
      // ... more employees
    ]
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGeneratePayroll = () => {
    // Implement payroll generation logic
    console.log("Generating payroll...");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Payment</h2>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-black p-6 rounded-lg">
          <h3 className="text-white text-lg mb-2">Total Employees</h3>
          <p className="text-white text-3xl font-bold">{payrollData.totalEmployees}</p>
          <p className="text-green-500">+10% from last month</p>
        </div>

        <div className="bg-black p-6 rounded-lg">
          <h3 className="text-white text-lg mb-2">Total Payroll</h3>
          <p className="text-white text-3xl font-bold">${payrollData.totalPayroll}</p>
          <p className="text-green-500">+20.1% from last month</p>
        </div>

        <div className="bg-black p-6 rounded-lg">
          <h3 className="text-white text-lg mb-2">YTD Payroll</h3>
          <p className="text-white text-3xl font-bold">${payrollData.ytdPayroll}</p>
          <p className="text-green-500">+19% from last year</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Employee ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Cost</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.employees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="p-4">{employee.id}</td>
                <td className="p-4">{employee.name}</td>
                <td className="p-4">${employee.cost}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    employee.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:text-blue-800">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleGeneratePayroll}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Generate Payroll
        </button>
      </div>
    </div>
  );
};

export default PayrollGenerator;