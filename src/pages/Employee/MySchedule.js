import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../../redux/action/scheduleAction";
import { format, startOfWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Returns just the date portion "YYYY-MM-DD" from an ISO string.
function getISODate(isoStr) {
  return isoStr.split("T")[0];
}

// Format the date/time in UTC.
function formatUTCDate(isoString) {
  const dateObj = new Date(isoString);
  return formatInTimeZone(dateObj, "UTC", "EEEE, MMM d, yyyy");
}

// Format the shift times in UTC.
function formatShiftTimeUTC(dateStr, timeStr) {
  const datePart = getISODate(dateStr);
  const combined = `${datePart}T${timeStr}:00.000Z`;
  const dateObj = new Date(combined);
  return formatInTimeZone(dateObj, "UTC", "HH:mm");
}

function MySchedule() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Create navigate function
  const { siteSchedules = [], loading, error } = useSelector((state) => state.schedule ?? {});
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    dispatch(fetchSchedule());
  }, [dispatch]);

  const handleDateChange = (selectedDate) => {
    const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
    setCurrentWeek(monday);
  };

  const currentWeekISO = currentWeek.toISOString().split("T")[0];
  const weekEnd = new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  const weekEndISO = weekEnd.toISOString().split("T")[0];

  // Filter and sort schedule items
  const filteredSchedule = Array.isArray(siteSchedules)
    ? siteSchedules
        .filter((item) => {
          if (!item.date) return false;
          const scheduleDay = getISODate(item.date);
          return scheduleDay >= currentWeekISO && scheduleDay <= weekEndISO;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
            <p className="mt-2 text-sm text-gray-600">View and manage your upcoming shifts</p>
          </div>
        </div>

        {/* Week Selection */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Select Week:</span>
              <DatePicker
                selected={currentWeek}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                showWeekNumbers
                filterDate={(date) => startOfWeek(date, { weekStartsOn: 1 }).getTime() === date.getTime()}
              />
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700 font-medium">{currentWeekISO} - {weekEndISO}</span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSchedule.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shifts scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">No shifts are scheduled for this week.</p>
          </div>
        )}

        {/* Schedule Table */}
        {!loading && !error && filteredSchedule.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedule.map((item, index) => {
                  if (!item.shiftId) return null;
                  const displayedDate = formatUTCDate(item.date);
                  const displayedStart = formatShiftTimeUTC(item.date, item.shiftId.startTime);
                  const displayedEnd = formatShiftTimeUTC(item.date, item.shiftId.endTime);

                  return (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.shiftId.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.shiftId.site.name}</div>
                          <div className="text-sm text-gray-500">ID: {item.shiftId.site.siteId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{displayedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-900">
                              {displayedStart} - {displayedEnd}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                            className="inline-flex items-center px-3 py-1.5 mr-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                          >
                            {expandedRow === index ? "Hide" : "View"}
                          </button>
                          {/* Swap button navigates to the swapshift form with shift id prefilled */}
                          <button
                            onClick={() => navigate("/employee/swap-shift", { state: { yourShiftId: item.shiftId._id } })}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150"
                          >
                            Swap
                          </button>

                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4">
                            <div className="bg-white rounded-lg border border-blue-100 p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Job Description</h4>
                                  <p className="text-sm text-gray-600">{item.shiftId.jobDescription}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Shift Id</h4>
                                  <p className="text-sm text-gray-600">{item.shiftId._id}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Location Details</h4>
                                  <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                      {item.shiftId.site.location.address}
                                    </span>
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center">
                                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      <span className="text-sm font-medium text-gray-900">Total Hours:</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{item.totalHours} hours</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MySchedule;
