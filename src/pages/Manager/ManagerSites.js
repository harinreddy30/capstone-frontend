import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSitesByManager
} from '../../redux/action/siteAction';
import { createShift, updateShift, fetchShifts, deleteShift, clearShiftsAction } from "../../redux/action/shiftAction";

// Helper function to format time for display
const formatTime = (timeString) => {
  try {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeString;
  }
};

const ManagerSites = ({ onModalOpen, onModalClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showShiftsModal, setShowShiftsModal] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [shiftForm, setShiftForm] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    hours: 0,
    jobDescription: "",
    applyToDays: [],
    siteId: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [shiftToDelete, setShiftToDelete] = useState(null);

  const dispatch = useDispatch();
  const { sites, loading, error } = useSelector((state) => state.sites);
  const { shifts } = useSelector((state) => state.shifts || { shifts: [] });

  useEffect(() => {
    if (sites.length === 0) {
      dispatch(fetchSitesByManager());
    }
  }, [dispatch, sites.length]);
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleShiftInputChange = (event) => {
    const { name, value } = event.target;
    setShiftForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === "startTime" || name === "endTime") {
      calculateHours(name, value);
    }
  };

  const handleDeleteShift = async (shift) => {
    setShiftToDelete(shift);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteShift = async () => {
    try {
      await dispatch(deleteShift(shiftToDelete._id));
      setShowDeleteConfirmModal(false);
      setSuccessMessage("Shift deleted successfully!");
      setShowSuccessModal(true);
      dispatch(fetchShifts(selectedSite._id));
    } catch (error) {
      console.error("Error deleting shift:", error);
      setSuccessMessage("Failed to delete shift. Please try again.");
      setShowSuccessModal(true);
    }
  };

  const openShiftModalForEdit = (shift) => {
    setEditMode(true);
    setSelectedSite(shift.site);
    
    const daysMapReverse = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    setShiftForm({
      shiftName: shift.position,
      startTime: shift.startTime,
      endTime: shift.endTime,
      hours: shift.hours,
      jobDescription: shift.jobDescription,
      // Since each shift now only has one day, we set the applyToDays array with that day
      applyToDays: [daysMapReverse[shift.day] || shift.day],
      siteId: shift.site._id,
      selectedShiftId: shift._id,
    });
    
    setShowShiftModal(true);
    setShowShiftsModal(false); // Close the shifts modal
    onModalOpen();
  };
  
  const calculateHours = (name, value) => {
    let { startTime, endTime } = shiftForm;
    if (name === "startTime") startTime = value;
    if (name === "endTime") endTime = value;
  
    if (startTime && endTime) {
      let start = new Date(`1970-01-01T${startTime}:00`);
      let end = new Date(`1970-01-01T${endTime}:00`);
  
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
  
      const diff = (end - start) / (1000 * 60 * 60); // Convert ms to hours
      setShiftForm((prev) => ({ ...prev, hours: diff }));
    }
  };
  
  const handleDaySelection = (day) => {
    setShiftForm((prev) => ({
      ...prev,
      applyToDays: prev.applyToDays.includes(day)
        ? prev.applyToDays.filter((d) => d !== day)
        : [...prev.applyToDays, day],
    }));
  };
  
  const openShiftModal = (site) => {
    setSelectedSite(site);
    setEditMode(false); // Reset edit mode when opening for new shift
    setShiftForm({
      shiftName: "",
      startTime: "",
      endTime: "",
      hours: 0,
      jobDescription: "",
      applyToDays: [],
      siteId: site._id, // Use _id instead of siteId
    });
    setShowShiftModal(true);
    onModalOpen();
  };
  
  const closeModal = () => {
    setShowShiftModal(false);
    if (showShiftsModal) {
      dispatch(clearShiftsAction());
      setShowShiftsModal(false);
    }
    setSelectedSite(null);
    setEditMode(false);
    onModalClose();
  };

  const openShiftsModal = async (site) => {
    setSelectedSite(site);
    setShowShiftsModal(true);
    onModalOpen();
    
    try {
      // Clear existing shifts first
      dispatch(clearShiftsAction());
      // Fetch new shifts
      await dispatch(fetchShifts(site._id));
    } catch (error) {
      console.error("Error fetching shifts:", error);
      alert("Failed to load shifts. Please try again.");
    }
  };

  // Updated handleAddShift: Create a shift for each selected day when not editing.
  const handleAddShift = async (event) => {
    event.preventDefault();
  
    if (!shiftForm.shiftName || !shiftForm.startTime || !shiftForm.endTime) {
      setSuccessMessage("Please fill in all the required fields.");
      setShowSuccessModal(true);
      return;
    }

    if (shiftForm.applyToDays.length === 0) {
      setSuccessMessage("Please select at least one day for the shift.");
      setShowSuccessModal(true);
      return;
    }
  
    const daysMap = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };
    
    try {
      if (editMode && shiftForm.selectedShiftId) {
        // For editing, update the existing shift using the first selected day.
        const formattedShift = {
          position: shiftForm.shiftName,  
          site: selectedSite._id,
          startTime: shiftForm.startTime, 
          endTime: shiftForm.endTime,
          jobDescription: shiftForm.jobDescription,
          day: daysMap[shiftForm.applyToDays[0]],
        };
        await dispatch(updateShift(shiftForm.selectedShiftId, formattedShift)); 
        setSuccessMessage("Shift updated successfully!");
      } else {
        // For creation, create a separate shift for each selected day.
        const shiftCreationPromises = shiftForm.applyToDays.map(day => {
          const formattedShift = {
            position: shiftForm.shiftName,  
            site: selectedSite._id,
            startTime: shiftForm.startTime, 
            endTime: shiftForm.endTime,
            jobDescription: shiftForm.jobDescription,
            day: daysMap[day],
          };
          return dispatch(createShift(formattedShift)); 
        });
        await Promise.all(shiftCreationPromises);
        setSuccessMessage("Shifts added successfully!");
      }
      
      setShowSuccessModal(true);
      closeModal();
      
      if (selectedSite) {
        openShiftsModal(selectedSite);
      }
    } catch (error) {
      console.error("Error handling shift:", error);
      setSuccessMessage(error.message || "Failed to save shift. Please try again.");
      setShowSuccessModal(true);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Site Management</h1>
        <input
          type="text"
          placeholder="Search sites by name or location..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites
          .filter((site) =>
            site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            site.location.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((site) => (
            <div key={site.siteId} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{site.name}</h3>
                  <p className="text-gray-600 mt-1">{site.location.address}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  ID: {site.siteId}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openShiftModal(site)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Add Shift
                </button>
                <button
                  onClick={() => openShiftsModal(site)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  View Shifts
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Updated View Shifts Modal */}
      {showShiftsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Shifts for {selectedSite ? selectedSite.name : "Loading..."}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : shifts && shifts.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  {shifts.map((shift) => (
                    <div key={shift._id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900">{shift.position}</h3>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>Time: {formatTime(shift.startTime)} - {formatTime(shift.endTime)}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p>Day: {shift.day}</p>
                            </div>
                            {shift.jobDescription && (
                              <div className="mt-2 p-2 bg-white rounded-md">
                                <p className="text-gray-700">{shift.jobDescription}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openShiftModalForEdit(shift)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteShift(shift)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mb-4">No shifts available for this site.</p>
                <button
                  onClick={() => {
                    setShowShiftsModal(false);
                    openShiftModal(selectedSite);
                  }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Shift
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editMode ? "Edit" : "Add"} Shift for {selectedSite ? selectedSite.name : "Loading..."}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddShift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
                <input
                  type="text"
                  name="shiftName"
                  value={shiftForm.shiftName}
                  onChange={handleShiftInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={shiftForm.startTime}
                    onChange={handleShiftInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={shiftForm.endTime}
                    onChange={handleShiftInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="text"
                  value={shiftForm.hours}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={shiftForm.jobDescription}
                  onChange={handleShiftInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply to Days:</label>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <label key={day} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                      <input
                        type="checkbox"
                        checked={shiftForm.applyToDays.includes(day)}
                        onChange={() => handleDaySelection(day)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  {editMode ? "Update" : "Add"} Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Shift</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this shift? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteShift}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSites;
