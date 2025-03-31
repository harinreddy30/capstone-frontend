import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, createUser, updateUser, DeleteUser } from "../../redux/action/userAction"; // Make sure actions are in place


const roles = ["Employee", "HR", "Manager", "PayrollManager"];
const userStatuses = ["active", "archived", "inactive"];

const UserManagement = ({ onModalOpen, onModalClose }) => {
  
  // const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [userForm, setUserForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    role: "Employee",
    hourlyWage: "0",
    status: "active"
  });

  // Add new state variables for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToArchive, setUserToArchive] = useState(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [userToReactivate, setUserToReactivate] = useState(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [userToInactive, setUserToInactive] = useState(null);

  const dispatch = useDispatch(); // Dispatch the action

    // Fetch Users from Redux store
  const { users, loading, error } = useSelector((state) => state.users);

  // Fetch Users from the API when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(fetchAllUsers());
    };
    fetchUsers();
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle input changes in form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Handle form submission for adding/updating user
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        await dispatch(updateUser(selectedUser._id, userForm));
        setSuccessMessage("User updated successfully!");
      } else {
        await dispatch(createUser(userForm));
        setSuccessMessage("User added successfully!");
      }
      setShowSuccessModal(true);
      closeModal();
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error submitting user data:", error);
      setSuccessMessage("Failed to save user. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Open modal for editing user
  const handleEdit = (user) => {
    setSelectedUser(user);
    // Format the date to YYYY-MM-DD for the input field
    const formattedDate = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "";
    
    setUserForm({
      fname: user.fname || "",
      lname: user.lname || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: formattedDate,
      isOnline: user.isOnline,
      role: user.role || "Employee",
      hourlyWage: user.hourlyWage ? user.hourlyWage.toString() : "0",
      status: user.status || "active"
    });
    setEditMode(true);
    setShowModal(true);
    onModalOpen && onModalOpen();
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedUser(null);
    setUserForm({
      fname: "",
      lname: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      role: "Employee",
      hourlyWage: "0",
      status: "active"
    });
    setShowModal(true);
    onModalOpen();
  };

  const openModal = () => {
    setShowModal(true);
    onModalOpen();
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedUser(null);
    setUserForm({
      fname: "",
      lname: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      role: "Employee",
      hourlyWage: "0",
      status: "active"
    });
    onModalClose();
  };

  // Update handleDelete to show confirmation modal
  const handleDelete = async (userId) => {
    const userToDelete = users.find(user => user._id === userId);
    setUserToDelete(userToDelete);
    setShowDeleteConfirmModal(true);
  };

  // Add confirmDelete function
  const confirmDelete = async () => {
    try {
      await dispatch(DeleteUser(userToDelete._id));
      setShowDeleteConfirmModal(false);
      setSuccessMessage("User deleted successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error deleting user:", error);
      setSuccessMessage("Failed to delete user. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle archive user
  const handleArchive = (user) => {
    setUserToArchive(user);
    setShowArchiveModal(true);
    // Reset archive reason when opening modal
    setArchiveReason("");
  };

  // Confirm archive
  const confirmArchive = async () => {
    try {
      const updatedUser = {
        ...userToArchive,
        status: userToArchive.status === "active" ? "archived" : "active",
        archiveDate: userToArchive.status === "active" ? new Date() : null,
        archiveReason: userToArchive.status === "active" ? archiveReason : null
      };
      await dispatch(updateUser(userToArchive._id, updatedUser));
      setShowArchiveModal(false);
      setSuccessMessage(userToArchive.status === "active" ? "User archived successfully!" : "User restored successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error updating user status:", error);
      setSuccessMessage("Failed to update user status. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle reactivate click
  const handleReactivateClick = (user) => {
    setUserToReactivate(user);
    setShowReactivateModal(true);
  };

  // Confirm reactivate
  const confirmReactivate = async () => {
    try {
      const updatedUser = {
        ...userToReactivate,
        status: "active",
        lastActiveDate: new Date()
      };
      await dispatch(updateUser(userToReactivate._id, updatedUser));
      setShowReactivateModal(false);
      setSuccessMessage("User reactivated successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error reactivating user:", error);
      setSuccessMessage("Failed to reactivate user. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle inactive click
  const handleInactiveClick = (user) => {
    setUserToInactive(user);
    setShowInactiveModal(true);
  };

  // Confirm inactive status
  const confirmInactive = async () => {
    try {
      const updatedUser = {
        ...userToInactive,
        status: "inactive",
        lastActiveDate: new Date()
      };
      await dispatch(updateUser(userToInactive._id, updatedUser));
      setShowInactiveModal(false);
      setSuccessMessage("User marked as inactive successfully!");
      setShowSuccessModal(true);
      await dispatch(fetchAllUsers());
    } catch (error) {
      console.error("Error marking user as inactive:", error);
      setSuccessMessage("Failed to mark user as inactive. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Filter users based on status and search term
  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.fname} ${user.lname} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your organization's users, roles, and permissions</p>
          </div>
          <button
            onClick={handleAddClick}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active Users</option>
            <option value="archived">Archived Users</option>
            <option value="inactive">Inactive Users</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Wage</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          {user.fname[0]}{user.lname[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fname} {user.lname}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'HR' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'Manager' ? 'bg-green-100 text-green-800' : 
                        user.role === 'PayrollManager' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'archived' ? 'bg-gray-100 text-gray-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.hourlyWage}/hr</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchive(user)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleInactiveClick(user)}
                          className="text-orange-600 hover:text-orange-900 mr-4"
                        >
                          Mark Inactive
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {user.status === 'archived' && (
                      <button
                        onClick={() => handleArchive(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Restore
                      </button>
                    )}
                    {user.status === 'inactive' && (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchive(user)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleReactivateClick(user)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reactivate
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="relative bg-white rounded-lg max-w-xl w-full mx-4 shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editMode ? "Edit User" : "Add New User"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="fname"
                      value={userForm.fname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lname"
                      value={userForm.lname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                    disabled={editMode}
                  />
                </div>

                {!editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={userForm.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    max={new Date().toISOString().split('T')[0]}
                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={userForm.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Wage</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="hourlyWage"
                      value={userForm.hourlyWage}
                      onChange={handleInputChange}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editMode ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {userToArchive?.status === "active" ? "Archive User" : "Restore User"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to {userToArchive?.status === "active" ? "archive" : "restore"} {userToArchive ? `${userToArchive.fname} ${userToArchive.lname}` : 'this user'}?
              </p>
              {userToArchive?.status === "active" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archive Reason</label>
                  <textarea
                    value={archiveReason}
                    onChange={(e) => setArchiveReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter reason for archiving..."
                    required
                  />
                </div>
              )}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmArchive}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                >
                  {userToArchive?.status === "active" ? "Archive" : "Restore"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Confirmation Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reactivate User</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to reactivate {userToReactivate ? `${userToReactivate.fname} ${userToReactivate.lname}` : 'this user'}?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowReactivateModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReactivate}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                >
                  Reactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${successMessage.includes("success") ? "bg-green-100" : "bg-yellow-100"} mb-4`}>
                {successMessage.includes("success") ? (
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{successMessage}</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete {userToDelete ? `${userToDelete.fname} ${userToDelete.lname}` : 'this user'}? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Inactive Confirmation Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mark User as Inactive</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to mark {userToInactive ? `${userToInactive.fname} ${userToInactive.lname}` : 'this user'} as inactive?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowInactiveModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmInactive}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                >
                  Mark Inactive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
