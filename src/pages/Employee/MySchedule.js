import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../../redux/action/scheduleAction";

const MySchedule = () => {
  const dispatch = useDispatch();
  const { schedule = [], loading, error } = useSelector((state) => state.schedule ?? {});
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(getMondayOfWeek(new Date())); // Default to current week

  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);


  useEffect(() => {
    console.log("Redux Store Schedule Data:", schedule);
  }, [schedule]);
  



  // Get Monday of the selected week
  function getMondayOfWeek(date) {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // Adjust to Monday
    return monday;
  }

  // Format Date
  function formatDate(dateStr) {
    return new Date(dateStr).toDateString();
  }

  // Format Time to AM/PM
  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  // Handle week selection from calendar
  const handleDateChange = (date) => {
    setCurrentWeek(getMondayOfWeek(date));

  };

  // Filter shifts for the selected week
  const filteredSchedule = schedule && Array.isArray(schedule) 
  ? schedule.filter((item) => {
      const shiftDate = new Date(item.date);
      const weekStart = new Date(currentWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Fix timezone issues by setting time to midnight (00:00:00)
      shiftDate.setHours(0, 0, 0, 0);
      weekStart.setHours(0, 0, 0, 0);
      weekEnd.setHours(23, 59, 59, 999);

      console.log("Checking Shift:", shiftDate, "vs Week Range:", weekStart, "-", weekEnd);
      return shiftDate >= weekStart && shiftDate <= weekEnd;
    }) 
  : [];


console.log("Filtered Schedule:", filteredSchedule);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">📅 My Schedule</h2>

      {/* Week Selection using Calendar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-semibold">Select Week:</p>
        <DatePicker
          selected={currentWeek}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          className="border px-3 py-2 rounded-md shadow-md"
          showWeekNumbers
          filterDate={(date) => date.getDay() === 1} // Only allow Mondays
        />
        <p className="text-lg font-semibold">
          {formatDate(currentWeek)} - {formatDate(new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000))}
        </p>
      </div>

      {/* Loading/Error Handling */}
      {loading && <p className="text-gray-500">Loading schedule...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Schedule Table */}
      {filteredSchedule.length === 0 ? (
        <p className="text-gray-500">No shifts available for this week.</p>
      ) : (
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-3 border">Position</th>
              <th className="p-3 border">Site ID</th>
              <th className="p-3 border">Site Name</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Timings</th>
              <th className="p-3 border text-center">More Info</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white hover:bg-gray-100 transition">
                  <td className="p-3 border">{item.shiftId.position}</td>
                  <td className="p-3 border">{item.shiftId.site.siteId}</td>
                  <td className="p-3 border">{item.shiftId.site.name}</td>
                  <td className="p-3 border">{formatDate(item.date)}</td>
                  <td className="p-3 border">
                    {formatTime(item.shiftId.startTime)} - {formatTime(item.shiftId.endTime)}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    >
                      {expandedRow === index ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* Expanded Row with More Details */}
                {expandedRow === index && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="p-4 border">
                      <div className="bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">📌 Shift Details</h3>
                        <p className="text-gray-700"><strong>Job Description:</strong> {item.shiftId.jobDescription}</p>
                        <p className="text-gray-700"><strong>📍 Address:</strong> {item.shiftId.site.location.address}</p>
                        <p className="text-gray-700"><strong>🕒 Total Hours:</strong> {item.totalHours} hrs</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySchedule;