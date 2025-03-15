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

  // Add new state for confirmation modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const { loading, error, leaveRequests } = useSelector((state) => state.leave);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(fetchLeavesByEmployee());
  }, [dispatch]);

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (start <= end) {
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
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

  // Modified to show confirmation modal first
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate, reason } = leaveRequest;
    if (new Date(startDate) < new Date()) {
      setSuccessMessage("Start date cannot be in the past.");
      setShowSuccessModal(true);
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setSuccessMessage("End date must be after the start date.");
      setShowSuccessModal(true);
      return;
    }
    if (!reason.trim()) {
      setSuccessMessage("Reason for leave is required.");
      setShowSuccessModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  // New function to handle actual submission after confirmation
  const confirmSubmit = async () => {
    try {
      await dispatch(createLeaveRequest(leaveRequest));
      setSuccessMessage("Leave request submitted successfully!");
      setShowSuccessModal(true);
      setIsFormVisible(false);
      setLeaveRequest({ startDate: "", endDate: "", reason: "", totalDays: 0, status: "Pending" });
      dispatch(fetchLeavesByEmployee());
    } catch (error) {
      setSuccessMessage("Failed to submit leave request. Please try again.");
      setShowSuccessModal(true);
    }
    setShowConfirmModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${getOrdinal(day)} ${month} ${year}`;
  };
  
  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
      case 1: return day + "st";
      case 2: return day + "nd";
      case 3: return day + "rd";
      default: return day + "th";
    }
  };
  
  const leaveRequestsArray = Array.isArray(leaveRequests) ? leaveRequests : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Time Off Requests</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your leave requests and view their status</p>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {isFormVisible ? "Close Form" : "Request Time Off"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Request Form */}
        {isFormVisible && (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  min={today}
                  value={leaveRequest.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  min={leaveRequest.startDate || today}
                  value={leaveRequest.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave</label>
              <textarea
                name="reason"
                value={leaveRequest.reason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                placeholder="Please provide a detailed reason for your leave request..."
                required
              ></textarea>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-700 font-medium">Total Days: {leaveRequest.totalDays}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

        {/* Leave Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Your Leave Requests</h3>
          </div>
          
          <div className="border-t border-gray-200">
            {leaveRequestsArray?.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-500">No leave requests found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {leaveRequestsArray.map((leave, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            leave.status === "Approved" ? "bg-green-100 text-green-800" :
                            leave.status === "Rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{leave.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Leave Request</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to submit this leave request for {leaveRequest.totalDays} days?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
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
    </div>
  );
};

export default LeaveRequests;
