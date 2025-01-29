import React, { useState, useEffect } from "react";
import axios from "axios";

const roles = ["Employee", "HR", "Manager", "PayrollManager"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    role: "Employee",
    hourlyWage: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        // Update existing user
        await axios.put(`/api/users/${selectedUser.employeeId}`, userForm);
      } else {
        // Create a new user
        await axios.post("/api/users", userForm);
      }
      setShowModal(false);
      setEditMode(false);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm(user);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setUserForm({
              fname: "",
              lname: "",
              email: "",
              password: "",
              phone: "",
              dateOfBirth: "",
              role: "Employee",
              hourlyWage: "",
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Hourly Wage</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) =>
              `${user.fname} ${user.lname} ${user.email}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border p-2">{user.employeeId}</td>
                <td className="border p-2">{user.fname} {user.lname}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">${user.hourlyWage}/hr</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {editMode ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={userForm.fname}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={userForm.lname}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userForm.email}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
                disabled={editMode} // Email should not be editable
              />
              {!editMode && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={userForm.password}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                />
              )}
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={userForm.phone}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={userForm.dateOfBirth}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
              <select
                name="role"
                value={userForm.role}
                onChange={handleInputChange}
                className="border p-2 w-full"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="hourlyWage"
                placeholder="Hourly Wage"
                value={userForm.hourlyWage}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {editMode ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
