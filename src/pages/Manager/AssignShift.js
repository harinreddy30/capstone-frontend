import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSitesByManager } from "../../redux/action/siteAction";
import { fetchShifts, clearShiftsAction } from "../../redux/action/shiftAction";
import { fetchAvailableEmployees } from "../../redux/action/userAction";
import { createSchedule, fetchSchedulesBySite } from "../../redux/action/scheduleAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, startOfWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Overlap
function doShiftsOverlap(startA, endA, startB, endB) {
  const toMin = (t) => {
    const [h, m] = t.split(":");
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  };
  return toMin(startA) < toMin(endB) && toMin(startB) < toMin(endA);
}

const formatUTC = (date) => {
  const zonedDate = toZonedTime(date, 'UTC'); 
  const dateKey = format(zonedDate, "yyyy-MM-dd");
  return dateKey;
};

const AssignShift = () => {
  const initialWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [showShiftsModal, setShowShiftsModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(initialWeekStart);

  const [assignments, setAssignments] = useState({});
  const [availableEmployees, setAvailableEmployees] = useState({});

  const dispatch = useDispatch();
  const { sites } = useSelector((state) => state.sites);
  const { shifts } = useSelector((state) => state.shifts || { shifts: [] });
  const allSchedules = useSelector((state) => state.schedule?.schedule) || [];

  // 1) load assignments from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("assignments");
    if (stored) {
      setAssignments(JSON.parse(stored));
    }
  }, []);

  // 2) persist assignments
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  // fetch sites
  useEffect(() => {
    if (sites.length === 0) {
      dispatch(fetchSitesByManager());
    }
  }, [dispatch, sites.length]);

  // whenever selectedSite changes, fetch schedules
  useEffect(() => {
    if (selectedSite) {
      dispatch(fetchSchedulesBySite(selectedSite._id));
    }
  }, [selectedSite, dispatch]);

  const openShiftsModal = (site) => {
    dispatch(clearShiftsAction());
    setSelectedSite(site);
    dispatch(fetchShifts(site._id));
    dispatch(fetchSchedulesBySite(site._id));
    setShowShiftsModal(true);
  };

  const closeModal = () => {
    setShowShiftsModal(false);
    setAssignments({});
    setAvailableEmployees({});
    localStorage.removeItem("assignments");
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  // 3) Only fetch employees once if not present
  useEffect(() => {
    if (!showShiftsModal) return;

    weekDates.forEach((date) => {
      const dayName = format(date, "EEEE");
      shifts.forEach((shift) => {
        if (shift.day === dayName) {
          const dateKey = format(date, "yyyy-MM-dd");
          const uniqueKey = `${dateKey}_${shift._id}`;

          if (!availableEmployees[uniqueKey]) {
            // fetch once
            dispatch(
              fetchAvailableEmployees(dayName, shift.startTime, shift.endTime)
            ).then((emps) => {
              setAvailableEmployees((prev) => ({
                ...prev,
                [uniqueKey]: emps,
              }));
            });
          }
        }
      });
    });
    // DO NOT add availableEmployees here or it re-runs each time we do setAvailableEmployees
  }, [showShiftsModal, weekDates, shifts, dispatch]);

  // 4) rebuild assignments from schedules
  useEffect(() => {
    if (showShiftsModal && selectedSite && allSchedules.length > 0) {
      const weekEndDate = addDays(weekStartDate, 6);
      const filtered = allSchedules.filter((sched) => {
        const rawDate = new Date(sched.date);
        if (isNaN(rawDate.getTime())) return false;
        const schedKey = formatUTC(sched.date);
        const schedDate = new Date(schedKey);
        return schedDate >= weekStartDate && schedDate <= weekEndDate;
      });

      const newAssignments = {};
      filtered.forEach((sched) => {
        if (!sched.shiftId?._id || !sched.userId?._id) return;
        const dateKey = formatUTC(sched.date);
        if (!newAssignments[dateKey]) {
          newAssignments[dateKey] = {};
        }
        newAssignments[dateKey][sched.shiftId._id] = sched.userId._id;
      });
      if (JSON.stringify(newAssignments) !== JSON.stringify(assignments)) {
        setAssignments(newAssignments);
      }
    }
    // omit assignments from deps
  }, [showShiftsModal, selectedSite, weekStartDate, allSchedules]);

  const handleAssignment = (date, shiftId, empId) => {
    const dateKey = formatUTC(date);
    setAssignments((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [shiftId]: empId,
      },
    }));
  };

  const handleUnassign = (date, shiftId) => {
    const dateKey = formatUTC(date);
    setAssignments((prev) => {
      const dayAssignments = { ...(prev[dateKey] || {}) };
      delete dayAssignments[shiftId];
      return {
        ...prev,
        [dateKey]: dayAssignments,
      };
    });
  };

  const handleConfirmAssignments = async () => {
    // local duplicate check
    for (const date in assignments) {
      const assigned = Object.values(assignments[date]).filter(Boolean);
      if (assigned.length !== new Set(assigned).size) {
        alert(`Duplicate assignment on ${date}`);
        return;
      }
    }
    // build
    const allAssign = [];
    for (const date in assignments) {
      for (const shiftId in assignments[date]) {
        const empId = assignments[date][shiftId];
        if (empId) {
          allAssign.push({ userId: empId, shiftId, date });
        }
      }
    }
    if (allAssign.length === 0) {
      alert("No employees assigned.");
      return;
    }
    // check backend duplicates
    for (const a of allAssign) {
      const dupe = allSchedules.find(
        (s) =>
          s.shiftId?._id === a.shiftId &&
          formatUTC(s.date) === a.date &&
          s.userId?._id === a.userId
      );
      if (dupe) {
        alert("Duplicate schedule exists in backend.");
        return;
      }
    }
    try {
      let count = 0;
      for (const a of allAssign) {
        const result = await dispatch(createSchedule(a));
        if (!result) return;
        count++;
      }
      alert(`Employees assigned for ${count} shifts!`);
      if (selectedSite) {
        await dispatch(fetchSchedulesBySite(selectedSite._id));
      }
      setAssignments({});
      localStorage.removeItem("assignments");
    } catch (err) {
      console.error("Error creating schedules:", err);
    }
  };

  return (
    <div className="p-6">
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
          onChange={(date) => setWeekStartDate(startOfWeek(date, { weekStartsOn: 1 }))}
          dateFormat="MMMM d, yyyy"
          className="border border-gray-300 p-2 rounded"
          showWeekNumbers
        />
      </div>

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

      {showShiftsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
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
              const dateKey = formatUTC(date);
              const dayName = format(date, "EEEE");
              const shiftsForDay = shifts.filter((shift) => shift.day === dayName);

              return (
                <div key={dateKey} className="mb-6 border-b pb-4">
                  <h3 className="text-xl font-medium mb-2">
                    {dayName}, {format(date, "MMM d, yyyy")}
                  </h3>
                  {shiftsForDay.length === 0 ? (
                    <p className="text-gray-500">No shifts available for this day.</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {shiftsForDay.map((shift) => {
                        const localAssign = assignments[dateKey]?.[shift._id] || "";
                        const schedule = allSchedules.find(
                          (s) =>
                            s.shiftId?._id === shift._id &&
                            formatUTC(s.date) === dateKey
                        );
                        const currentAssign =
                          localAssign || (schedule ? schedule.userId._id : "");
                        const isScheduled = Boolean(currentAssign);

                        // find employees
                        const employeesKey = `${format(date, "yyyy-MM-dd")}_${shift._id}`;
                        const rawEmployees = availableEmployees[employeesKey] || [];
                        let finalEmployees = [...rawEmployees];
                        if (
                          isScheduled &&
                          !rawEmployees.some((emp) => emp._id === currentAssign)
                        ) {
                          const assignedEmp = schedule?.userId;
                          if (assignedEmp) {
                            finalEmployees.push(assignedEmp);
                          }
                        }

                        // Overlap filtering
                        const overlappingIds = new Set();
                        const dayAssigns = assignments[dateKey] || {};
                        Object.entries(dayAssigns).forEach(([otherShiftId, assignedEmpId]) => {
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
                            overlappingIds.add(assignedEmpId);
                          }
                        });

                        const filteredEmployees = finalEmployees.filter((emp) =>
                          emp._id === currentAssign || !overlappingIds.has(emp._id)
                        );

                        if (isScheduled) {
                          const assignedEmp =
                            filteredEmployees.find((emp) => emp._id === currentAssign) ||
                            schedule?.userId;
                          return (
                            <div
                              key={shift._id}
                              className="flex-1 min-w-[200px] border p-4 rounded shadow bg-gray-200 cursor-not-allowed"
                            >
                              <p className="font-semibold">
                                {shift.position} ({shift.startTime} - {shift.endTime})
                              </p>
                              <p className="mt-2">
                                {assignedEmp
                                  ? `${assignedEmp.fname} ${assignedEmp.lname}`
                                  : "Scheduled"}
                              </p>
                              <button
                                onClick={() => handleUnassign(date, shift._id)}
                                className="mt-2 text-red-500 text-sm"
                                style={{ pointerEvents: "auto" }}
                              >
                                Clear Assignment
                              </button>
                            </div>
                          );
                        }

                        // otherwise => dropdown
                        return (
                          <div
                            key={shift._id}
                            className="flex-1 min-w-[200px] border p-4 rounded shadow"
                          >
                            <p className="font-semibold">
                              {shift.position} ({shift.startTime} - {shift.endTime})
                            </p>
                            <select
                              value={currentAssign}
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
