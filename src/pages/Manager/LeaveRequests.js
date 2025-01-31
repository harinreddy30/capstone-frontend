import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveRequests, updateLeaveStatus } from "../../redux/action/leaveAction";

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { leaveRequests, loading, error } = useSelector((state) => state.leave);

  // Local state to track status changes
  const [updatedLeaves, setUpdatedLeaves] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); 
  
  useEffect(() => {
    dispatch(fetchLeaveRequests()); // Fetch all leave requests when component mounts
  }, [dispatch]);

  const handleStatusChange = (id, newStatus) => {
    setUpdatedLeaves((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleSubmit = (id) => {
    if (!updatedLeaves[id]) return;
    dispatch(updateLeaveStatus(id, updatedLeaves[id]));
    alert(`Leave request ${id} updated to ${updatedLeaves[id]}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Manage Leave Requests</h2>
      
      {loading && <p className="text-center">Loading leave requests...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Employee</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests?.map((leave) => (
            <tr key={leave.id} className="border">
              <td className="border p-2">{leave.employeeName}</td>
              <td className="border p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
              <td className="border p-2">{leave.reason}</td>
              <td className="border p-2">
                <select
                  className="border p-1"
                  value={updatedLeaves[leave.id] || leave.status}
                  onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSubmit(leave.id)}
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;
