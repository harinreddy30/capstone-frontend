import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSites,
  fetchSitesByManager
} from '../../redux/action/siteAction'
import { createShift, updateShift, fetchShifts, deleteShift } from "../../redux/action/shiftAction";

const ManagerSites = ({ onModalOpen, onModalClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showShiftsModal, setShowShiftsModal] = useState(false); 
  const [editMode, setEditMode] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  // const [shifts, setShifts] = useState([]); 
  const [shiftForm, setShiftForm] = useState({
    shiftName: "",
    startTime: "",
    endTime: "",
    hours: 0,
    jobDescription: "",
    applyToDays: [],
    siteId: "",
  });

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

  const handleDeleteShift = async (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      try {
        await dispatch(deleteShift(shiftId));
        alert("Shift deleted successfully!");
        dispatch(fetchShifts(selectedSite._id)); // Optionally, refresh the shifts for the current site
      } catch (error) {
        console.error("Error deleting shift:", error);
      }
    }
  };
  
  const openShiftModalForEdit = (shift) => {
    setEditMode(true); 
    const site = sites.find(site => site._id === shift.site._id);

    if (!site) {
      console.error("Site not found for shift:", shift.site);
      return; // Exit if no site is found
    }
    setSelectedSite(site)
    setShiftForm({
      shiftName: shift.position,
      startTime: shift.startTime,
      endTime: shift.endTime,
      hours: shift.hours, 
      jobDescription: shift.jobDescription,
      applyToDays: shift.days, 
      siteId: shift.site, 
      selectedShiftId: shift._id, 
    });
    setShowShiftModal(true); 
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
    setShiftForm({
      shiftName: "",
      startTime: "",
      endTime: "",
      hours: 0,
      jobDescription: "",
      applyToDays: [],
      siteId: site.siteId,
    });
    setShowShiftModal(true);
    onModalOpen();
  };
  
  const closeModal = () => {
    setShowShiftModal(false);
    setShowShiftsModal(false);
    setEditMode(false);
    onModalClose();
  };

  const openShiftsModal =  (site) => {
    setSelectedSite(site);
    try {
      dispatch(fetchShifts(site._id));
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
    setShowShiftsModal(true);
    onModalOpen();
  };

  const handleAddShift = async (event) => {
    event.preventDefault();
  
    if (!shiftForm.shiftName || !shiftForm.startTime || !shiftForm.endTime) {
      alert("Please fill in all the required fields.");
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
    
    const formattedShift = {
      position: shiftForm.shiftName,  
      site: selectedSite._id, 
      startTime: shiftForm.startTime, 
      endTime: shiftForm.endTime,
      jobDescription: shiftForm.jobDescription,
      days: shiftForm.applyToDays.map((day) => daysMap[day]), 
    };
  
    if (shiftForm.selectedShiftId) {
      try {
        await dispatch(updateShift(shiftForm.selectedShiftId, formattedShift)); 
        alert("Shift updated successfully!");
      } catch (error) {
        console.error("Error updating shift:", error);
      }
    } else {
      try {
        await dispatch(createShift(formattedShift)); 
        alert("Shift added successfully!");
      } catch (error) {
        console.error("Error creating shift:", error);
      }
    }

    closeModal();
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
      </div>

      {/* Sites Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Site ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites
            .filter((site) =>
              site.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((site) => (
              <tr key={site.siteId} className="text-center">
                <td className="border p-2">{site.siteId}</td>
                <td className="border p-2">{site.name}</td>
                <td className="border p-2">{site.location.address}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openShiftModal(site)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Shift
                  </button>
                  <button
                    onClick={() => openShiftsModal(site)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    View Shifts
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

       {/* View Shifts Modal */}
       {showShiftsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Shifts for {selectedSite ? selectedSite.name : "Loading..."}
            </h2>
            
            {shifts.length > 0 ? (
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Position</th>
                    <th className="border p-2">Start Time</th>
                    <th className="border p-2">End Time</th>
                    <th className="border p-2">Days</th>
                    <th className="border p-2">Job Description</th>
                    <th className="border p-2">Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift._id} className="text-center">
                      <td className="border p-2">{shift.position}</td>
                      <td className="border p-2">{shift.startTime}</td>
                      <td className="border p-2">{shift.endTime}</td>
                      <td className="border p-2">
                        {shift.days.join(", ")}
                      </td>
                      <td className="border p-2">{shift.jobDescription}</td>
                      <td className="border p-2">
                      <button
                          onClick={() => openShiftModalForEdit(shift)} // Call openShiftModalForEdit
                          className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteShift(shift._id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No shifts available for this site.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Add Shift for {selectedSite ? selectedSite.name : "Loading..."}
            </h2>
            <form onSubmit={handleAddShift}>
              <div className="mb-3">
                <label className="block text-sm font-medium">Shift Name</label>
                <input
                  type="text"
                  name="shiftName"
                  value={shiftForm.shiftName}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={shiftForm.startTime}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={shiftForm.endTime}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Hours</label>
                <input
                  type="text"
                  value={shiftForm.hours}
                  readOnly
                  className="border p-2 w-full rounded bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Job Description
                </label>
                <textarea
                  name="jobDescription"
                  value={shiftForm.jobDescription}
                  onChange={handleShiftInputChange}
                  className="border p-2 w-full rounded"
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Apply to Days:
                </label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shiftForm.applyToDays.includes(day)}  // This ensures the checkbox is checked based on previous selection
                        onChange={() => handleDaySelection(day)} // Toggle the selected day
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Shift
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSites;
