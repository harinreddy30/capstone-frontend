import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllReport, createReport, updateReport, DeleteReport, fetchReportsByEmployee
} from "../../redux/action/reportAction";

const IncidentReport = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);

  const [showModal, setShowModal] = useState(false);
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
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const {reportName, reportDescription, incidentDate, status} = reportForm;
    if (new Date(incidentDate) > new Date()){
      alert("Report Time cannot be in future");
      return;
    }
    if (!reportDescription.trim()){
      alert("Description Required");
      return;
    }

    await dispatch(createReport(reportForm));
    setShowModal(false);
    setEditMode(false);
    setReportForm({ reportName: "", reportDescription: "", incidentDate: "", status: "" });

    await dispatch(fetchReportsByEmployee());
    // try {
    //   if (editMode) {
    //     dispatch(updateReport(selectedReport._id, reportForm));
    //   } else {
    //     dispatch(createReport(reportForm));
    //   }
    //   setShowModal(false);
    //   setEditMode(false);
    //   dispatch(fetchAllReport()); // Refresh Report list
    // } catch (error) {
    //   console.error("Error submitting Report data:", error);
    // }
  };

  // Handle Edit Report
  const handleEdit = (report) => {
    setSelectedReport(report);
    setReportForm(report);
    setEditMode(true);
    setShowModal(true);
  };

  // Handle Delete Report
  const handleDelete = (reportId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (confirmDelete) {
      dispatch(DeleteReport(reportId))
      dispatch(fetchReportsByEmployee()) // Refresh reports after deletion
    }
  };

  

  return (
    <div className="max-w-3xl mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Create Report
      </button>
      
      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error.message || "An error occurred"}</p>}

      <ul>
        {reports.map((report, index) => (
          <li key={index} className="p-3 bg-white rounded shadow mb-2">
            <h3 className="font-bold">{report.reportName}</h3>
            <p>{report.reportDescription}</p>
            <p><strong>Incident Date:</strong> {new Date(report.incidentDate).toLocaleString()}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <button 
              className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              onClick={() => handleEdit(report)}
            >
              Edit
            </button>
            <button 
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(report._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Report" : "Create Report"}</h2>
            <form onSubmit={handleSubmit}>
            <label className="font-bold mb-2 block" htmlFor="reportName">
            Incident Type (Report Name)
            </label>
            <select
              id="reportName"
              name="reportName"
              className="w-full p-3 border border-gray-300 rounded"
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
              
              <label className="block mb-2">Description:</label>
              <textarea 
                name="reportDescription" 
                value={reportForm.reportDescription} 
                onChange={handleInputChange} 
                className="w-full p-2 border rounded mb-4"
                required
              ></textarea>
              
              <label className="block mb-2">Incident Date:</label>
              <input 
                type="datetime-local" 
                name="incidentDate" 
                value={reportForm.incidentDate} 
                onChange={handleInputChange} 
                className="w-full p-2 border rounded mb-4"
                required
              />
              
              <label className="font-bold mb-2 block" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={reportForm.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
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
