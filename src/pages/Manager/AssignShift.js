import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSitesByManager } from "../../redux/action/siteAction";
import { fetchShifts, clearShiftsAction } from "../../redux/action/shiftAction";
import { fetchAvailableEmployees } from "../../redux/action/userAction";
import { createSchedule, fetchSchedulesBySite } from "../../redux/action/scheduleAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, startOfWeek } from "date-fns";

/**
 * Helper to check if two shifts overlap in time.
 * Adjust as needed for exact boundary conditions.
 */
function doShiftsOverlap(startA, endA, startB, endB) {
  // Convert "HH:mm" strings to minutes since midnight
  const toMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(":");
    return parseInt(hh, 10) * 60 + parseInt(mm, 10);
  };

  const shiftAStart = toMinutes(startA);
  const shiftAEnd = toMinutes(endA);
  const shiftBStart = toMinutes(startB);
  const shiftBEnd = toMinutes(endB);

  return shiftAStart < shiftBEnd && shiftBStart < shiftAEnd;
}

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
  // Safely select schedules; default to an empty array if undefined.
  const allSchedules = useSelector((state) => state.schedule?.schedule) || [];

  useEffect(() => {
    if (sites.length === 0) {
      dispatch(fetchSitesByManager());
    }
  }, [dispatch, sites.length]);

  /**
   * Opens the modal for a specific site, fetching that site’s shifts
   * and schedules.
   */
  const openShiftsModal = (site) => {
    dispatch(clearShiftsAction());
    setSelectedSite(site);
    dispatch(fetchShifts(site._id));
    // Fetch schedules for the site using our action:
    dispatch(fetchSchedulesBySite(site._id));
    setShowShiftsModal(true);
  };

  /**
   * Closes the modal and clears local state.
   */
  const closeModal = () => {
    setShowShiftsModal(false);
    setAssignments({});
    setAvailableEmployees({});
  };

  /**
   * Generate 7 days of the week, starting from weekStartDate (Monday).
   */
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  /**
   * Fetches the list of employees available for a given date and shift.
   */
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

  /**
   * Whenever shifts or the week changes (and the modal is open),
   * fetch employees for each shift that matches the day.
   */
  useEffect(() => {
    if (shifts.length > 0 && showShiftsModal) {
      weekDates.forEach((date) => {
        const dayName = format(date, "EEEE");
        shifts.forEach((shift) => {
          if (shift.day === dayName) {
            fetchEmployeesForShift(date, shift);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, weekStartDate, showShiftsModal]);

  /**
   * Build local assignments from the fetched schedules.
   * We filter the schedules to only include those in the current week.
   */
  useEffect(() => {
    if (showShiftsModal && selectedSite && allSchedules.length > 0) {
      const weekEndDate = addDays(weekStartDate, 6);
      const filteredSchedules = allSchedules.filter((sched) => {
        const schedDate = new Date(sched.date);
        return schedDate >= weekStartDate && schedDate <= weekEndDate;
      });
  
      const newAssignments = {};
      filteredSchedules.forEach((sched) => {
        // Skip if shiftId is null or missing an _id
        if (!sched.shiftId || !sched.shiftId._id) {
          console.log("Skipping schedule with null or invalid shiftId:", sched);
          return;
        }
        // Also skip if userId is missing
        if (!sched.userId || !sched.userId._id) {
          console.log("Skipping schedule with null or invalid userId:", sched);
          return;
        }
  
        const dateKey = format(new Date(sched.date), "yyyy-MM-dd");
        if (!newAssignments[dateKey]) {
          newAssignments[dateKey] = {};
        }
        // Use shiftId._id as the key, userId._id as the value
        newAssignments[dateKey][sched.shiftId._id] = sched.userId._id;
      });
  
      console.log("Filtered Schedules:", filteredSchedules);
      console.log("New Assignments Object:", newAssignments);
  
      setAssignments(newAssignments);
    }
  }, [showShiftsModal, selectedSite, weekStartDate, allSchedules]);
  

  /**
   * Assigns an employee to a given shift on a given date.
   */
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

  /**
   * Unassign an employee for a given date and shift.
   */
  const handleUnassign = (date, shiftId) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setAssignments((prev) => {
      const dayAssignments = { ...(prev[formattedDate] || {}) };
      delete dayAssignments[shiftId];
      return {
        ...prev,
        [formattedDate]: dayAssignments,
      };
    });
  };

  /**
   * Confirm assignments by dispatching createSchedule for each assignment.
   * Also checks for duplicate assignments on the same day.
   */
  const handleConfirmAssignments = async () => {
    for (const date in assignments) {
      const dayAssignments = assignments[date];
      const assignedEmployees = Object.values(dayAssignments).filter(Boolean);
      if (assignedEmployees.length !== new Set(assignedEmployees).size) {
        alert(
          `Duplicate assignment detected on ${date}. Please ensure the same employee isn't scheduled twice in one day.`
        );
        return;
      }
    }

    const allAssignments = [];
    for (const date in assignments) {
      for (const shiftId in assignments[date]) {
        const employeeId = assignments[date][shiftId];
        if (employeeId) {
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

      weekDates.forEach((date) => {
        const dayName = format(date, "EEEE");
        shifts.forEach((shift) => {
          if (shift.day === dayName) {
            fetchEmployeesForShift(date, shift);
          }
        });
      });

      setAssignments({});
    } catch (error) {
      console.error("Error assigning shifts:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
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
          <div className="relative bg-white p-6 rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Shifts for {selectedSite?.name}
            </h2>
            {weekDates.map((date) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              const dayName = format(date, "EEEE");
              const shiftsForDay = shifts.filter((shift) => shift.day === dayName);
              return (
                <div key={formattedDate} className="mb-6 border-b pb-4">
                  <h3 className="text-xl font-medium mb-2">
                    {dayName}, {format(date, "MMM d, yyyy")}
                  </h3>
                  {shiftsForDay.length === 0 ? (
                    <p className="text-gray-500">No shifts available for this day.</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {shiftsForDay.map((shift) => {
                        const dateAssignments = assignments[formattedDate] || {};
                        const overlappingEmployeeIds = new Set();

                        Object.entries(dateAssignments).forEach(([otherShiftId, assignedEmpId]) => {
                          if (!assignedEmpId || otherShiftId === shift._id) return;
                          const otherShift = shifts.find((s) => s._id === otherShiftId);
                          if (!otherShift) return;
                          if (
                            doShiftsOverlap(
                              shift.startTime,
                              shift.endTime,
                              otherShift.startTime,
                              otherShift.endTime
                            )
                          ) {
                            overlappingEmployeeIds.add(assignedEmpId);
                          }
                        });

                        const rawEmployees = availableEmployees[`${formattedDate}_${shift._id}`] || [];
                        const filteredEmployees = rawEmployees.filter(
                          (emp) => !overlappingEmployeeIds.has(emp._id)
                        );

                        return (
                          <div
                            key={shift._id}
                            className="flex-1 min-w-[200px] border p-4 rounded shadow"
                          >
                            <p className="font-semibold">
                              {shift.position} ({shift.startTime} - {shift.endTime})
                            </p>
                            <select
                              value={dateAssignments[shift._id] || ""}
                              onChange={(e) => handleAssignment(date, shift._id, e.target.value)}
                              className="border border-gray-300 p-2 rounded w-full mt-2"
                            >
                              <option value="">Select Employee</option>
                              {filteredEmployees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                  {emp.fname} {emp.lname}
                                </option>
                              ))}
                            </select>
                            {dateAssignments[shift._id] && (
                              <button
                                onClick={() => handleUnassign(date, shift._id)}
                                className="mt-2 text-red-500 text-sm"
                              >
                                Clear Assignment
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
