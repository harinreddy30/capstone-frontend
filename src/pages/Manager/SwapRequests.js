import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSwapRequests,
  approveSwapRequest,
  rejectSwapRequest,
  deleteSwapRequest,
} from "../../redux/action/swapShiftAction";
import { fetchShiftById } from "../../redux/action/shiftAction"; 
import { fetchSiteById } from "../../redux/action/siteAction";   
import { userById } from "../../redux/action/userAction";   

// Helper to format status (e.g., "approved" → "Approved")
const formatStatus = (status) => {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const SwapRequests = () => {
  const dispatch = useDispatch();

  // Get data from Redux.
  const { swapRequests, loading, error } = useSelector((state) => state.swaps);
  const { data: shiftData = {}, loading: shiftLoading } = useSelector(
    (state) => state.shifts
  );
  const { data: siteData = {}, loading: siteLoading } = useSelector(
    (state) => state.sites
  );
  const { data: userData = {}, loading: userLoading } = useSelector(
    (state) => state.users
  );

  // Local state for modals and messages.
  const [updatedSwaps, setUpdatedSwaps] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteId, setDeleteId] = useState(null);

  // 1. On mount, fetch all swap requests.
  useEffect(() => {
    dispatch(fetchAllSwapRequests());
  }, [dispatch]);

  // 2. When swapRequests update, fetch related shifts.
  useEffect(() => {
    if (swapRequests && swapRequests.length > 0) {
      const shiftIds = [];
      swapRequests.forEach((swap) => {
        shiftIds.push(swap.shiftId1, swap.shiftId2);
      });
      const uniqueShiftIds = [...new Set(shiftIds)];
      uniqueShiftIds.forEach((id) => {
        dispatch(fetchShiftById(id));
      });
    }
  }, [swapRequests, dispatch]);

  // 3. When swapRequests update, fetch related users.
  useEffect(() => {
    if (swapRequests && swapRequests.length > 0) {
      const userIds = new Set();
      swapRequests.forEach((swap) => {
        if (swap.requestedBy) userIds.add(swap.requestedBy);
      });
      userIds.forEach((id) => {
        dispatch(userById(id));
      });
    }
  }, [swapRequests, dispatch]);

  // 4. Compute missing site IDs using useMemo.
  const missingSiteIds = useMemo(() => {
    if (!shiftData || Object.keys(shiftData).length === 0) return [];
    const siteIds = new Set();
    Object.values(shiftData).forEach((shift) => {
      if (shift.site) siteIds.add(shift.site);
    });
    return [...siteIds].filter((siteId) => !siteData[siteId]);
  }, [shiftData, siteData]);

  // 5. Fetch missing sites only when the missingSiteIds array changes.
  useEffect(() => {
    missingSiteIds.forEach((siteId) => {
      dispatch(fetchSiteById(siteId));
    });
  }, [missingSiteIds, dispatch]);

  // Filter swap requests based on the selected status.
  const filteredRequests = swapRequests?.filter((swap) => {
    if (filterStatus === "All") return true;
    return formatStatus(swap.status) === filterStatus;
  });

  // Approve/Reject logic.
  const handleStatusChange = (id, newStatus) => {
    setUpdatedSwaps((prev) => ({ ...prev, [id]: newStatus }));
    setSelectedStatus(newStatus);
    setSelectedSwap(id);
    setShowConfirmModal(true);
  };

  const handleSubmit = async (id) => {
    if (!updatedSwaps[id]) return;
    try {
      if (updatedSwaps[id] === "Approved") {
        await dispatch(approveSwapRequest(id));
      } else if (updatedSwaps[id] === "Rejected") {
        await dispatch(rejectSwapRequest(id));
      }
      setShowConfirmModal(false);
      setSuccessMessage(`Swap request successfully ${updatedSwaps[id].toLowerCase()}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchAllSwapRequests());
    } catch (error) {
      console.error("Error updating swap status:", error);
      setSuccessMessage("Error updating swap status");
    }
  };

  // Delete logic.
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSwapRequest(id));
      setShowDeleteModal(false);
      setSuccessMessage("Swap request successfully deleted");
      setTimeout(() => setSuccessMessage(""), 3000);
      dispatch(fetchAllSwapRequests());
    } catch (error) {
      console.error("Error deleting swap request:", error);
    }
  };

  // Render shift details: display the site's name.
  // Render shift details: display the site name, plus other shift info (start/end time, hours).
const renderShiftDetails = (shiftId) => {
    if (!shiftId) return "N/A";
    const shift = shiftData[shiftId];
    if (shiftLoading) return "Loading...";
    if (!shift) return "Not found";
  
    const siteId = shift.site;
    const site = siteData[siteId];
    const siteName = site ? site.name || "N/A" : "Loading...";
  
    const { startTime, endTime, totalHours, position, day } = shift;
  
    return (
      <div className="text-sm space-y-1">
        <div>
          <strong>Site:</strong> {siteName}
        </div>
        {position && (
          <div>
            <strong>Position:</strong> {position}
          </div>
        )}
        {day && (
          <div>
            <strong>Day:</strong> {day}
          </div>
        )}
        {startTime && (
          <div>
            <strong>Start Time:</strong> {startTime}
          </div>
        )}
        {endTime && (
          <div>
            <strong>End Time:</strong> {endTime}
          </div>
        )}
        {typeof totalHours === "number" && (
          <div>
            <strong>Hours:</strong> {totalHours}
          </div>
        )}
      </div>
    );
  };
  

  // Render user details.
  const renderUserName = (userId) => {
    if (!userId) return "Unknown Employee";
    const user = userData[userId];
    if (userLoading) return "Loading...";
    if (!user) return "Unknown Employee";
    return `${user.fname} ${user.lname}`;
  };

  // Determine badge color based on status.
  const getStatusColor = (status) => {
    const formatted = formatStatus(status);
    switch (formatted) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Heading & Filter */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Swap Requests</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage all employee swap requests
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 flex items-center">
          <svg
            className="h-5 w-5 text-green-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {/* Loading & Error */}
      {(loading || shiftLoading || siteLoading || userLoading) && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift 1 Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift 2 Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Swap Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests && filteredRequests.length > 0 ? (
              filteredRequests.map((swap) => (
                <tr key={swap._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{renderUserName(swap.requestedBy)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderShiftDetails(swap.shiftId1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderShiftDetails(swap.shiftId2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {swap.date
                        ? new Date(swap.date).toLocaleDateString("en-US", { timeZone: "UTC" })
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {swap.createdAt
                        ? new Date(swap.createdAt).toLocaleDateString("en-US", { timeZone: "UTC" })
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(swap.status)}`}>
                      {formatStatus(swap.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      className={`mr-2 text-sm rounded-md ${formatStatus(swap.status) !== "Pending" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"}`}
                      value={updatedSwaps[swap._id] || formatStatus(swap.status)}
                      onChange={(e) => handleStatusChange(swap._id, e.target.value)}
                      disabled={formatStatus(swap.status) !== "Pending"}
                    >
                      <option value="Pending" disabled>Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => {
                        setDeleteId(swap._id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No swap requests available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Status Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Status Update</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to mark this swap request as {selectedStatus}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(selectedSwap)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this swap request? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapRequests;
