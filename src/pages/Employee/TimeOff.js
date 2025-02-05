import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLeaveRequest, fetchLeavesByEmployee } from "../../redux/action/leaveAction";

const LeaveRequests = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    totalDays: 0,
    status: "Pending",
  });

  const dispatch = useDispatch();
  const { loading, error, leaveRequests } = useSelector((state) => state.leave);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchLeavesByEmployee());
  }, [dispatch]);

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start < end) {
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRequest = { ...leaveRequest, [name]: value };

    if (name === "startDate" || name === "endDate") {
      updatedRequest.totalDays = calculateTotalDays(updatedRequest.startDate, updatedRequest.endDate);
    }

    setLeaveRequest(updatedRequest);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { startDate, endDate, reason } = leaveRequest;
    if (new Date(startDate) < new Date()) {
      alert("Start date cannot be in the past.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after the start date.");
      return;
    }
    if (!reason.trim()) {
      alert("Reason for leave is required.");
      return;
    }

    dispatch(createLeaveRequest(leaveRequest));
    setIsFormVisible(false);
    dispatch(fetchLeavesByEmployee());
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Leave Requests</h2>

      {loading && <p className="text-blue-500 text-center">Fetching leave requests...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="mb-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
      >
        {isFormVisible ? "Close Form" : "Request Leave"}
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              min={today}
              value={leaveRequest.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              min={leaveRequest.startDate || today}
              value={leaveRequest.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Reason</label>
            <textarea
              name="reason"
              value={leaveRequest.reason}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your reason"
              required
            ></textarea>
          </div>

          <p className="text-gray-700 font-semibold mb-4">Total Days: {leaveRequest.totalDays}</p>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Submit Request
          </button>
        </form>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Leave Requests</h3>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          {leaveRequests?.length === 0 ? (
            <p className="text-gray-500 text-center">No leave requests found.</p>
          ) : (
            <ul>
              {leaveRequests.map((leave, index) => (
                <li key={index} className="p-4 bg-white rounded-md shadow-sm mb-2">
                  <p className="text-gray-800">
                    <strong>Start:</strong> {leave.startDate} | <strong>End:</strong> {leave.endDate}
                  </p>
                  <p className="text-gray-600"><strong>Reason:</strong> {leave.reason}</p>
                  <p className={`font-semibold ${leave.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                    Status: {leave.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
