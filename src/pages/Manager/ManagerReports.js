import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllReport, DeleteReport, updateReport } from "../../redux/action/reportAction";

// Helper function to format report names
const formatReportName = (name) => {
  if (!name) return '';
  // Add spaces before capital letters and trim extra spaces
  const withSpaces = name.replace(/([A-Z])/g, ' $1').trim();
  // Capitalize first letter and handle multiple words
  return withSpaces.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ManagerReports = ({ onModalOpen, onModalClose }) => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState(null);

  useEffect(() => {
    dispatch(fetchAllReport());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter reports based on search term and status
  const filteredReports = reports.filter((report) => {
    const searchLower = search.toLowerCase();
    const fullName = `${report.createdBy?.fname || ''} ${report.createdBy?.lname || ''}`.toLowerCase();
    
    return (report.reportName?.toLowerCase().includes(searchLower) ||
            fullName.includes(searchLower) ||
            report.status?.toLowerCase().includes(searchLower)) &&
            report.status === 'Pending'; // Only show pending reports
  });

  // Handle Delete Report
  const handleDelete = async (reportId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Site?");
    if (confirmDelete) {
      await dispatch(DeleteReport(reportId));
      dispatch(fetchAllReport());
    }
  };

  // Handle Status Update Confirmation
  const handleStatusUpdateConfirm = async () => {
    if (!statusUpdateData) return;
    
    try {
      // Always save as Resolved in database
      const statusToSave = 'Resolved';
      
      await dispatch(updateReport(statusUpdateData.reportId, { 
        ...statusUpdateData.report, 
        status: statusToSave 
      }));
      await dispatch(fetchAllReport());
      setShowStatusModal(false);
      setStatusUpdateData(null);
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update report status');
    }
  };

  // Handle Status Update
  const handleStatusUpdate = (report, newStatus) => {
    setStatusUpdateData({
      reportId: report._id,
      report: report,
      newStatus: newStatus
    });
    setShowStatusModal(true);
  };

  // Modified to handle modal state
  const handleViewReport = (report) => {
    setSelectedReport(report);
    onModalOpen();
  };

  // Modified close modal function
  const closeModal = () => {
    setSelectedReport(null);
    onModalClose();
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Incident Reports Management</h1>
        <input
          type="text"
          placeholder="Search by report name, employee, or status..."
          value={search}
          onChange={handleSearch}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {formatReportName(report.reportName)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap mb-4">{report.reportDescription}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Created By:</span>
                    <span className="ml-2 text-gray-600">
                      {`${report.createdBy?.fname || "Unknown"} ${report.createdBy?.lname || ""}`}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="ml-2 text-gray-600">{report.createdBy?.role}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Incident Date:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(report.incidentDate).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Report ID:</span>
                    <span className="ml-2 text-gray-600">{report.reportId}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  onClick={() => handleViewReport(report)}
                >
                  View Details
                </button>
                <select
                  value={report.status}
                  onChange={(e) => handleStatusUpdate(report, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Mark as Resolved</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Update Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Status Update</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this report as "{statusUpdateData?.newStatus}"?
              {statusUpdateData?.newStatus === 'Closed' && 
                " This will remove the report from the active list."}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusUpdateData(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdateConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{formatReportName(selectedReport.reportName)}</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Description:</p>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.reportDescription}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-700">Incident Date:</p>
                  <p className="text-gray-600">{new Date(selectedReport.incidentDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Status:</p>
                  <select
                    value={selectedReport.status}
                    onChange={(e) => handleStatusUpdate(selectedReport, e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Mark as Resolved</option>
                  </select>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Created By:</p>
                  <p className="text-gray-600">
                    {`${selectedReport.createdBy?.fname || "Unknown"} ${selectedReport.createdBy?.lname || ""}`}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Role:</p>
                  <p className="text-gray-600">{selectedReport.createdBy?.role}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReports;
