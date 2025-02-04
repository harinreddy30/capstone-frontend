import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveRequests, updateLeaveStatus, DeleteRequest } from "../../redux/action/leaveAction";

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { leaveRequests, loading, error } = useSelector((state) => state.leave);

  
  // Local state to track status changes
  const [updatedLeaves, setUpdatedLeaves] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedLeave, setSelectedleave] = useState(null);
   
  
  useEffect(() => {
    dispatch(fetchLeaveRequests()); // Fetch all leave requests when component mounts
  }, [dispatch]);

  console.log("Leave Requests Data:", leaveRequests);

  const handleStatusChange = (id, newStatus) => {
    setUpdatedLeaves((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleSubmit = async (id) => {
    if (!updatedLeaves[id]) return; // Ensure a new status is selected
  
    try {
      await dispatch(updateLeaveStatus(id, { status: updatedLeaves[id] })); // Send only { status: "APPROVED" }
  
      setSuccessMessage(`Leave request ${id} updated to ${updatedLeaves[id]}`);
      setTimeout(() => setSuccessMessage(""), 3000);
  
      dispatch(fetchLeaveRequests()); // Refresh leave requests after updating
    } catch (error) {
      console.error("Error updating leave status:", error);
      setSuccessMessage("Error updating leave status");
    }
  };
  
  


  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this request?");
  if (confirmDelete) {
    try {
      await dispatch(DeleteRequest(id)); // Ensure delete request completes
      dispatch(fetchLeaveRequests()); // Refresh leave requests after deletion
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  }
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
          {leaveRequests?.getLeave?.length > 0 ? (
            leaveRequests?.getLeave
            .map((leave) => (
              <tr key={leave._id} className="border">
                <td className="border p-2">
                  {leave?.userId ? `${leave.userId.fname} ${leave.userId.lname}` : "Unknown Employee"}
                </td>
                <td className="border p-2">
                  {leave?.startDate ? new Date(leave.startDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="border p-2">
                  {leave?.endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="border p-2">{leave?.reason || "No reason provided"}</td>
                <td className="border p-2">
                  <select
                    className="border p-1"
                    value={updatedLeaves[leave._id] || leave.status}
                    onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleSubmit(leave._id)}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => handleDelete(leave._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">No leave requests available</td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default LeaveManagement;