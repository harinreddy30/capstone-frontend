import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmployeeList = ({ onModalOpen, onModalClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  
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

  const handleAddEmployee = () => {
    setShowModal(true);
    onModalOpen();
  };

  const closeModal = () => {
    setShowModal(false);
    onModalClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <button 
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
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
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-lg">
            <option value="">All Locations</option>
            <option value="main">Main Office</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="west">West Branch</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option value="">All Roles</option>
            <option value="supervisor">Supervisor</option>
            <option value="guard">Security Guard</option>
            <option value="oncall">On-call Guard</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="p-4 border-b last:border-b-0 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {employee.id}
              </div>
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-gray-600">{employee.role}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>{employee.location}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-600 hover:text-gray-800">⋮</button>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            {/* Add your form fields here */}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;