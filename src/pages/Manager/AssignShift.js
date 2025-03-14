import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSitesByManager } from "../../redux/action/siteAction";
import { fetchShifts, clearShiftsAction } from "../../redux/action/shiftAction";
import { fetchAvailableEmployees } from "../../redux/action/userAction";
import { createSchedule } from "../../redux/action/scheduleAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, startOfWeek } from "date-fns";

const AssignShift = () => {
  // Start week on Monday
  const initialWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftsModal, setShowShiftsModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(initialWeekStart);

  // assignments: { "yyyy-MM-dd": { [shiftId]: employeeId } }
  const [assignments, setAssignments] = useState({});
  // availableEmployees: { "yyyy-MM-dd_shiftId": [employees] }
  const [availableEmployees, setAvailableEmployees] = useState({});

  const dispatch = useDispatch();
  const { sites } = useSelector((state) => state.sites);
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
    setAssignments({});
    setAvailableEmployees({});
  };

  // Generate the week’s dates starting from weekStartDate (Monday)
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  // Fetch available employees for a specific shift on a specific date
  const fetchEmployeesForShift = async (date, shift) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const shiftDay = format(date, "EEEE");
    try {
      const employees = await dispatch(
        fetchAvailableEmployees(shiftDay, shift.startTime, shift.endTime)
      );
      setAvailableEmployees((prev) => ({
        ...prev,
        [`${formattedDate}_${shift._id}`]: employees,
      }));
    } catch (error) {
      console.error("Error fetching available employees:", error);
    }
  };

  // When shifts or the week changes (and the modal is open), fetch employees
  useEffect(() => {
    if (shifts.length > 0 && showShiftsModal) {
      weekDates.forEach((date) => {
        const dayName = format(date, "EEEE");
        shifts.forEach((shift) => {
          if (shift.days.includes(dayName)) {
            fetchEmployeesForShift(date, shift);
          }
        });
      });
    }
  }, [shifts, weekStartDate, showShiftsModal]);

  // Update local assignments for a given date and shift
  const handleAssignment = (date, shiftId, employeeId) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setAssignments((prev) => ({
      ...prev,
      [formattedDate]: {
        ...prev[formattedDate],
        [shiftId]: employeeId,
      },
    }));
  };

  // Confirm all assignments
  const handleConfirmAssignments = async () => {
    // Loop over each day to check for duplicate assignments
    for (const date in assignments) {
      const dayAssignments = assignments[date]; // { shiftId: employeeId, ... }
      // Filter out unassigned shifts
      const assignedEmployees = Object.values(dayAssignments).filter(empId => empId);
      // If any employee is scheduled twice on the same day, the Set size will be smaller than the array length.
      if (assignedEmployees.length !== new Set(assignedEmployees).size) {
        alert(
          `Duplicate assignment detected on ${date}. Please ensure the same employee isn't scheduled twice in one day.`
        );
        return; // Stop the submission process
      }
    }
  
    // Build an array of assignments (skip any shift that is unassigned)
    const allAssignments = [];
    for (const date in assignments) {
      for (const shiftId in assignments[date]) {
        const employeeId = assignments[date][shiftId];
        if (employeeId) { // Only process assigned shifts
          allAssignments.push({
            userId: employeeId,
            shiftId,
            date,
          });
        }
      }
    }
  
    if (allAssignments.length === 0) {
      alert("No employees assigned. Nothing to save.");
      return;
    }
  
    try {
      for (const assignment of allAssignments) {
        await dispatch(createSchedule(assignment));
      }
      alert(`Employees assigned successfully for ${allAssignments.length} shifts!`);
      
      // Optionally, refresh available employees for each shift here
      weekDates.forEach(date => {
        const dayName = format(date, "EEEE");
        shifts.forEach((shift) => {
          if (shift.days.includes(dayName)) {
            fetchEmployeesForShift(date, shift);
          }
        });
      });
      
      // Clear assignments after successful submission
      setAssignments({});
    } catch (error) {
      console.error("Error assigning shifts:", error);
    }
  };
  

  return (
    <div className="p-6">
      {/* Top bar with search and date picker */}
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/3 mb-2 sm:mb-0"
        />
        <DatePicker
          selected={weekStartDate}
          onChange={(date) =>
            setWeekStartDate(startOfWeek(date, { weekStartsOn: 1 }))
          }
          dateFormat="MMMM d, yyyy"
          className="border border-gray-300 p-2 rounded"
          showWeekNumbers
        />
      </div>

      {/* Sites Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Site ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Location</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites
            .filter((site) =>
              site.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((site) => (
              <tr key={site.siteId} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{site.siteId}</td>
                <td className="border px-4 py-2">{site.name}</td>
                <td className="border px-4 py-2">{site.location.address}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => openShiftsModal(site)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Shifts
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showShiftsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Smaller, scrollable container */}
          <div className="relative bg-white p-6 rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
            {/* Close (X) Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4">
              Shifts for {selectedSite?.name}
            </h2>

            {/* Week's days stacked vertically */}
            {weekDates.map((date) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const dayName = format(date, "EEEE");
                // Filter the shifts that match the day
                const shiftsForDay = shifts.filter((shift) =>
                    shift.days.includes(dayName)
                );
                return (
                    <div key={formattedDate} className="mb-6 border-b pb-4">
                    <h3 className="text-xl font-medium mb-2">
                        {dayName}, {format(date, "MMM d, yyyy")}
                    </h3>
                    {shiftsForDay.length === 0 ? (
                        <p className="text-gray-500">No shifts available for this day.</p>
                    ) : (
                        // Flex container to display shift cards side by side
                        <div className="flex flex-wrap gap-4">
                        {shiftsForDay.map((shift) => (
                            <div
                            key={shift._id}
                            className="flex-1 min-w-[200px] border p-4 rounded shadow"
                            >
                            <p className="font-semibold">
                                {shift.position} ({shift.startTime} - {shift.endTime})
                            </p>
                            <select
                                value={assignments[formattedDate]?.[shift._id] || ""}
                                onChange={(e) =>
                                handleAssignment(date, shift._id, e.target.value)
                                }
                                className="border border-gray-300 p-2 rounded w-full mt-2"
                            >
                                <option value="">Select Employee</option>
                                {(availableEmployees[`${formattedDate}_${shift._id}`] || []).map(
                                (emp) => (
                                    <option key={emp._id} value={emp._id}>
                                    {emp.fname} {emp.lname}
                                    </option>
                                )
                                )}
                            </select>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                );
                })}


            {/* Confirm and Back Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                onClick={handleConfirmAssignments}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm All Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignShift;
