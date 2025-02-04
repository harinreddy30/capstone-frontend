import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - replace with Redux state later
  const employees = [
    {
      id: "JS",
      name: "John Smith",
      role: "Supervisor",
      location: "Main Office"
    },
    {
      id: "ED",
      name: "Emily Davis",
      role: "Site Supervisor",
      location: "North Branch"
    },
    {
      id: "CW",
      name: "Chris Wilson",
      role: "Security Guard",
      location: "South Branch"
    },
    {
      id: "MJ",
      name: "Mary Johnson",
      role: "On-call Guard",
      location: "West Branch"
    },
    {
      id: "AB",
      name: "Alex Brown",
      role: "Security Guard",
      location: "South Branch"
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Employee List</h2>
        <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 flex items-center gap-2">
          <span>+</span> Add Employee
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 bg-black text-white border border-gray-700 rounded-lg">
            <option value="">All Locations</option>
            <option value="main">Main Office</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="west">West Branch</option>
          </select>
          <select className="px-4 py-2 bg-black text-white border border-gray-700 rounded-lg">
            <option value="">All Roles</option>
            <option value="supervisor">Supervisor</option>
            <option value="guard">Security Guard</option>
            <option value="oncall">On-call Guard</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="p-4 bg-black border border-gray-800 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white">
                {employee.id}
              </div>
              <div>
                <h3 className="text-white font-semibold">{employee.name}</h3>
                <p className="text-gray-400">{employee.role}</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📍</span>
                  <span>{employee.location}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">⋮</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;