import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSitesByManager } from "../../redux/action/siteAction";
import { fetchShifts, clearShiftsAction } from "../../redux/action/shiftAction";
import { fetchAvailableEmployees } from "../../redux/action/userAction";
import { createSchedule } from "../../redux/action/scheduleAction";

const AssignShift = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftsModal, setShowShiftsModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [dayAssignments, setDayAssignments] = useState({}); 
  const [availableEmployees, setAvailableEmployees] = useState({}); 

  const dispatch = useDispatch();
  const { sites, loading, error } = useSelector((state) => state.sites);
  const { shifts } = useSelector((state) => state.shifts || { shifts: [] });

  useEffect(() => {
    if (sites.length === 0) {
      dispatch(fetchSitesByManager());
    }
  }, [dispatch, sites.length]);

  
  const openShiftsModal = (site) => {
    dispatch(clearShiftsAction());
    setSelectedSite(site);
    dispatch(fetchShifts(site._id));
    setShowShiftsModal(true);
  };

  const closeModal = () => {
    setShowShiftsModal(false);
    setSelectedShift(null);
    setDayAssignments({});
    setAvailableEmployees({});
  };

  // Fetch available employees for a given shift day
  const fetchEmployeesForDay = async (day, startTime, endTime) => {
    try {
      const employees = await dispatch(fetchAvailableEmployees(day, startTime, endTime));
      setAvailableEmployees(prev => ({ ...prev, [day]: employees })); // ✅ Avoids accessing undefined
    } catch (error) {
      console.error("Error fetching available employees:", error);
    }
  };
  

  // Assign Employee for a specific day
  const handleDayAssignment = (day, employeeId) => {
    setDayAssignments(prev => ({ ...prev, [day]: employeeId }));
  };

  // When shift is selected, fetch available employees per shift day
  useEffect(() => {
    if (selectedShift) {
      const shift = shifts.find((s) => s._id === selectedShift);
      if (shift) {
        console.log("Fetching employees for shift:", shift); // ✅ Debugging
        shift.days.forEach(day => fetchEmployeesForDay(day, shift.startTime, shift.endTime));
      }
    }
  }, [selectedShift]);
  

  // Confirm assignment for all selected days
  const handleAssignShift = async () => {
    if (!selectedShift) {
      alert("Please select a shift.");
      return;
    }

    const shift = shifts.find((s) => s._id === selectedShift);
    if (!shift) {
      alert("Shift not found.");
      return;
    }

    try {
      const assignedDays = Object.keys(dayAssignments).filter(
        (day) => dayAssignments[day]
      );

      if (assignedDays.length === 0) {
        alert("Please assign at least one employee.");
        return;
      }

      for (const day of assignedDays) {
        await dispatch(
          createSchedule({
            shiftId: selectedShift,
            employeeId: dayAssignments[day],
            day: day,
          })
        );
      }

      alert(`Employees assigned successfully to ${assignedDays.length} schedules!`);
      setDayAssignments({});
      setSelectedShift(null);
    } catch (error) {
      console.error("Error assigning shift:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

            {loading ? (
              <p>Loading shifts...</p>
            ) : shifts.length > 0 ? (
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Position</th>
                    <th className="border p-2">Start Time</th>
                    <th className="border p-2">End Time</th>
                    <th className="border p-2">Days</th>
                    <th className="border p-2">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <React.Fragment key={shift._id}>
                      <tr className="text-center">
                        <td className="border p-2">{shift.position}</td>
                        <td className="border p-2">{shift.startTime}</td>
                        <td className="border p-2">{shift.endTime}</td>
                        <td className="border p-2">{shift.days.join(", ")}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => setSelectedShift(shift._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>

                      {/* Assign Employees for Each Day */}
                      {selectedShift === shift._id &&
                        shift.days.map((day) => (
                          <tr key={day} className="bg-gray-100">
                            <td colSpan="5" className="border p-4">
                              <h3 className="text-lg font-semibold mb-2">
                                Assign for {day}
                              </h3>
                              <select
                                value={dayAssignments[day] || ""}
                                onChange={(e) => handleDayAssignment(day, e.target.value)}
                                className="border p-3 rounded w-full shadow-sm"
                              >
                                <option value="">Select Employee</option>
                                {availableEmployees[day]?.map((emp) => (
                                  <option key={emp._id} value={emp._id}>
                                    {emp.fname} {emp.lname}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No shifts available for this site.</p>
            )}

            <button onClick={handleAssignShift} className="bg-blue-500 text-white px-4 py-2 rounded">
              Confirm Assignments
            </button>
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignShift;
