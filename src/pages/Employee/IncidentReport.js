import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllReport, createReport, updateReport, DeleteReport, fetchReportById
} from "../../redux/action/reportAction"



const IncidentReport = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
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
    created: user?.name || "", // Autofill from Redux state
  });

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReportForm({ ...reportForm, [name]: value });
  };

  // Fetch Users from the API when component mounts
  useEffect(() => {
    dispatch(fetchAllReport()); // Dispatch the action to fetch Reports
  }, [dispatch]); // This ensures it only runs once when the component is mounted
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editMode) {
        // Update existing Report
        dispatch(updateReport(selectedReport._id, reportForm));
      } else {
        // Create a new Report
        dispatch(createReport(reportForm));
      }
      setShowModal(false);
      setEditMode(false);
      dispatch(fetchAllReport()); // Refresh Report list
  
    } catch (error) {
      console.error("Error submitting Report data:", error);
    }
  };

  // Handle Update User
  const handleEdit = (report) => {
    setSelectedReport(report);
    setReportForm(report);
    setEditMode(true);
    setShowModal(true);
  };

  // Handle Delete User
  const handleDelete = (reportId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Report?");
    if (confirmDelete) {
      dispatch(DeleteReport(reportId)); // Dispatch delete action
      dispatch(fetchAllReport()); // Refresh user list after deletion
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <form className="flex flex-col">
        {/* Date/Time of Incident */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentDateTime">
            Date/Time of Incident
          </label>
          <input
            type="datetime-local"
            id="incidentDateTime"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentLocation">
            Location
          </label>
          <input
            type="text"
            id="incidentLocation"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter location"
          />
        </div>

        {/* Reported By */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="reportedBy">
            Reported By
          </label>
          <input
            type="text"
            id="reportedBy"
            className="w-full p-3 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
            value="John Doe (Autofilled)" // Example value from backend token
            disabled
          />
        </div>

        {/* Employee Involved */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="employeeInvolved">
            Employee Involved
          </label>
          <input
            type="text"
            id="employeeInvolved"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter employee's name"
          />
        </div>

        {/* Position */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="position">
            Position
          </label>
          <input
            type="text"
            id="position"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter position"
          />
        </div>

        {/* Incident Type */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentType">
            Incident Type
          </label>
          <select
            id="incidentType"
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Select incident type</option>
            <option value="safety">Safety</option>
            <option value="harassment">Harassment</option>
            <option value="propertyDamage">Property Damage</option>
            <option value="injury">Injury</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description of Incident */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="incidentDescription">
            Description of Incident
          </label>
          <textarea
            id="incidentDescription"
            className="w-full p-3 border border-gray-300 rounded resize-y"
            rows="5"
            placeholder="Describe the incident"
          ></textarea>
        </div>

        {/* Witnesses */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="witnesses">
            Witnesses
          </label>  
          <textarea
            id="witnesses"
            className="w-full p-3 border border-gray-300 rounded resize-y"
            rows="3"
            placeholder="Enter witnesses (if any)"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold text-lg py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default IncidentReport;
