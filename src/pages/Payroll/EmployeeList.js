import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/action/userAction";
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  
  // Get auth state to check user role
  const { user } = useSelector((state) => state.auth);
  
  // Get users state
  const { users = [], loading = false, error = null } = useSelector((state) => {
    console.log('Users from state:', state.users); // Debug log
    return state.users || {};
  });

  useEffect(() => {
    // Check if user has permission to view employees
    if (!user) {
      navigate('/login');
      return;
    }

    // Only allow HR, PayrollManager, and Manager roles to view employees
    const allowedRoles = ['HR', 'PayrollManager', 'Manager'];
    if (!allowedRoles.includes(user.role)) {
      console.log('User role not authorized:', user.role);
      return;
    }

    console.log('Fetching users with role:', user.role);
    dispatch(fetchAllUsers());
  }, [dispatch, user, navigate]);

  // Show unauthorized message if user doesn't have permission
  if (!user || !['HR', 'PayrollManager', 'Manager'].includes(user.role)) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-500">
          You do not have permission to view this page. Please contact your administrator.
        </div>
      </div>
    );
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    console.log('Search term:', e.target.value); // Debug log
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    console.log('Selected role:', e.target.value); // Debug log
  };

  // Updated filtering logic
  const filteredUsers = users.filter(user => {
    // Search by name or email
    const searchFields = [
      `${user.fname} ${user.lname}`.toLowerCase(),
      user.email.toLowerCase(),
      user.employeeId?.toString()
    ].join(' ');
    
    const matchesSearch = !searchTerm || 
      searchFields.includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || 
      user.role.toLowerCase() === selectedRole.toLowerCase();

    console.log(`Filtering user ${user.fname}:`, { matchesSearch, matchesRole }); // Debug log
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee List</h2>
        {/* Only show Add Employee button for HR */}
        {user.role === 'HR' && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            + Add Employee
          </button>
        )}
      </div>

      {/* Show error message if API call fails */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 border rounded-lg pl-10"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>
        <select 
          className="px-4 py-2 border rounded-lg"
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value="">All Roles</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
          <option value="PayrollManager">Payroll Manager</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-4 border-b last:border-b-0 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {user.fname[0]}{user.lname[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {user.fname} {user.lname}
                      <span className="ml-2 text-sm text-gray-500">#{user.employeeId}</span>
                    </h3>
                    <p className="text-gray-600">{user.role}</p>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span>📧</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    ${user.hourlyWage}/hr
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No employees found matching your search criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;