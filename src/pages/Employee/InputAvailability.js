import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvailability, resetAvailability, getAvailability } from "../../redux/action/availabilityAction";
import { useNavigate } from "react-router-dom";

const Availability = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availability = useSelector((state) => state.availability.availability);
  const { loading, error } = useSelector((state) => state.availability);

  // Default availability structure
  const [formData, setFormData] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  // Add state for modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Fetch availability data when component mounts
  useEffect(() => {
    dispatch(getAvailability());
  }, [dispatch]);

  // Update formData when availability data is received
  useEffect(() => {
    if (availability) {
      // Convert the availability data format to match the form's format
      const formattedData = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      // Check if availability is an array (multiple days) or object (single day)
      if (Array.isArray(availability)) {
        // If it's an array of availability slots
        availability.forEach(slot => {
          if (slot.day && slot.start_time && slot.end_time) {
            formattedData[slot.day].push({
              startTime: slot.start_time,
              endTime: slot.end_time,
              available: slot.available
            });
          }
        });
      } else {
        // If it's an object with days as keys
        Object.keys(availability).forEach(day => {
          if (Array.isArray(availability[day])) {
            formattedData[day] = availability[day].map(slot => ({
              startTime: slot.start_time,
              endTime: slot.end_time,
              available: slot.available !== false // default to true if not specified
            }));
          }
        });
      }

      setFormData(formattedData);
    }
  }, [availability]);

  const handleChange = (e, day, index) => {
    const { name, value } = e.target;
    const newAvailability = JSON.parse(JSON.stringify(formData));
    newAvailability[day][index][name] = value;
    setFormData(newAvailability);
  };

  const handleRemoveSlot = (day, index) => {
    const newAvailability = JSON.parse(JSON.stringify(formData));
    newAvailability[day] = newAvailability[day].filter((_, i) => i !== index);
    setFormData(newAvailability);
  };

  const handleAddSlot = (day) => {
    const newAvailability = { ...formData };
    newAvailability[day] = [...newAvailability[day], { startTime: "", endTime: "", available: true }];
    setFormData(newAvailability);
  };

  // Modified to show confirmation modal first
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // New function to handle actual submission after confirmation
  const confirmSubmit = async () => {
    const formattedAvailability = [];

    // Convert the form data to the API's expected format
    Object.keys(formData).forEach((day) => {
      if (formData[day].length > 0) {
        formData[day].forEach((slot) => {
          if (slot.startTime && slot.endTime) {
            formattedAvailability.push({
              day: day,
              start_time: slot.startTime,
              end_time: slot.endTime,
              available: true
            });
          }
        });
      }
    });

    const response = await dispatch(updateAvailability({ availability: formattedAvailability }));
    setShowConfirmModal(false);

    if (response) {
      setSuccessMessage("Your availability has been updated successfully!");
      setShowSuccessModal(true);
      
      // Refresh the availability data
      dispatch(getAvailability());
    }
  };

  // Modified to show reset confirmation modal first
  const handleReset = () => {
    setShowResetConfirmModal(true);
  };

  // New function to handle actual reset after confirmation
  const confirmReset = () => {
    setFormData({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });
    dispatch(resetAvailability());
    setShowResetConfirmModal(false);
    setSuccessMessage("Availability has been reset.");
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
            <p className="mt-2 text-sm text-gray-600">Set your weekly availability schedule for work assignments</p>
          </div>
          <button
            onClick={() => navigate("/employee/my-availability")}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{day}</h3>
                <button
                  type="button"
                  onClick={() => handleAddSlot(day)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Time Slot
                </button>
              </div>

              {formData[day].length === 0 ? (
                <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No availability set for {day}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData[day].map((slot, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          value={slot.startTime || ""}
                          onChange={(e) => handleChange(e, day, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          value={slot.endTime || ""}
                          onChange={(e) => handleChange(e, day, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(day, index)}
                          disabled={formData[day].length <= 1}
                          className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset All
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              Save Changes
            </button>
          </div>
        </form>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save Availability</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to save your availability schedule? This will update your working hours for all selected days.
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Availability</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to reset all availability settings? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowResetConfirmModal(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
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
    </div>
  );
};

export default Availability;
