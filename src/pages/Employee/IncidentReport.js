import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
   createReport, updateReport, DeleteReport, fetchReportsByEmployee
} from "../../redux/action/reportAction";

const IncidentReport = ({ onModalOpen, onModalClose }) => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // State for form fields
  const [reportForm, setReportForm] = useState({
    reportName: "",
    reportDescription: "",
    incidentDate: "",
    status: "",
  });

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportForm({ ...reportForm, [name]: value });
  };

  // Fetch Reports from the API when component mounts
  useEffect(() => {
    const fetchReports = async () => {
          await dispatch(fetchReportsByEmployee());
        };
        fetchReports(); 
  }, [dispatch]);
  
  // Modified to handle modal state
  const handleCreateClick = () => {
    setShowModal(true);
    onModalOpen();
  };

  // Modified close modal function
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setReportForm({
      reportName: "",
      reportDescription: "",
      incidentDate: "",
      status: "",
    });
    onModalClose();
  };

  // Modified handleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const {reportName, reportDescription, incidentDate} = reportForm;
    
    // Validate form data
    if (new Date(incidentDate) > new Date()){
      alert("Report Time cannot be in future");
      return;
    }
    if (!reportDescription.trim()){
      alert("Description Required");
      return;
    }

    try {
      // Create the new report with default pending status
      const formDataWithStatus = {
        ...reportForm,
        status: "Pending" // Set default status for new reports
      };
      
      const createResponse = await dispatch(createReport(formDataWithStatus));
      
      if (createResponse?.error) {
        throw new Error(createResponse.error);
      }

      // Close the modal and reset form
      closeModal();
      setEditMode(false);
      setReportForm({ 
        reportName: "", 
        reportDescription: "", 
        incidentDate: "", 
        status: "Pending" 
      });

      // Fetch all reports to update the list
      await dispatch(fetchReportsByEmployee());
    } catch (error) {
      console.error('Error handling report submission:', error);
      alert('Failed to create report. Please try again.');
    }
  };

  // Handle Edit Report
  const handleEdit = (report) => {
    setSelectedReport(report);
    setReportForm(report);
    setEditMode(true);
    setShowModal(true);
  };

  // Updated Handle Delete Report
  const handleDelete = (reportId) => {
    setDeleteReportId(reportId);
    setShowDeleteModal(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (deleteReportId) {
      await dispatch(DeleteReport(deleteReportId));
      await dispatch(fetchReportsByEmployee());
      setShowDeleteModal(false);
      setDeleteReportId(null);
    }
  };

  // Handle Delete Cancel
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteReportId(null);
  };

  // Helper function to format incident type display
  const formatIncidentType = (type) => {
    if (!type) return '';
    // Split by capital letters and join with spaces
    return type
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
      .join(' ')
      .trim(); // Remove extra spaces
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Incident Reports</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
          onClick={handleCreateClick}
        >
          Create Report
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-4">
        {reports.length === 0 && !loading ? (
          <p className="text-gray-600">No incident reports found.</p>
        ) : (
          reports.map((report, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {formatIncidentType(report.reportName)}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{report.reportDescription}</p>
                </div>
                <button 
                  className="text-red-500 hover:text-red-600 px-3 py-1 rounded-md border border-red-500 hover:border-red-600 transition-colors duration-200"
                  onClick={() => handleDelete(report._id)}
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Incident Date:</span>
                  <span className="ml-2 text-gray-600">{new Date(report.incidentDate).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this incident report? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{editMode ? "Edit Report" : "Create Report"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Incident Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="reportName">
                  Incident Type (Report Name)
                </label>
                <select
                  id="reportName"
                  name="reportName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={reportForm.reportName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select incident type</option>
                  <option value="safety">Safety</option>
                  <option value="harassment">Harassment</option>
                  <option value="propertyDamage">Property Damage</option>
                  <option value="injury">Injury</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  name="reportDescription" 
                  value={reportForm.reportDescription} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px]"
                  placeholder="Please include: Security site name and shift time"
                  required
                ></textarea>
              </div>
              
              {/* Incident Date */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Date
                </label>
                <input 
                  type="datetime-local" 
                  name="incidentDate" 
                  value={reportForm.incidentDate} 
                  onChange={handleInputChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReport;
