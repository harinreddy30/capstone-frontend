import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailability } from "../../redux/action/availabilityAction";

const ViewAvailability = () => {
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.availability);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      dispatch(getAvailability());
      setInitialized(true);
    }
  }, [dispatch, initialized]);

  const daysOfWeek = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Filter and sort employees based on search term and selected day
  const getFilteredEmployees = () => {
    if (!availability || !Array.isArray(availability)) return [];

    return availability
      .filter((employee) => {
        const fullName = `${employee.userId?.fname} ${employee.userId?.lname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        const matchesDay = selectedDay === "All" || (employee[selectedDay] && employee[selectedDay].length > 0);
        return matchesSearch && matchesDay;
      })
      .sort((a, b) => {
        const nameA = `${a.userId?.fname} ${a.userId?.lname}`.toLowerCase();
        const nameB = `${b.userId?.fname} ${b.userId?.lname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  };

  const formatTime = (timeStr) => {
    try {
      return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Availability</h1>
            <p className="mt-2 text-sm text-gray-600">View and manage employee availability schedules</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day === "All" ? "All Days" : day}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State - Enhanced for 404 */}
        {error && error.includes('404') ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="rounded-full bg-yellow-100 p-3 mx-auto w-12 h-12">
              <svg 
                className="w-6 h-6 text-yellow-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Availability Data</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              There is currently no availability data for any employees. This could mean:
            </p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Employees haven't set their availability yet
              </li>
              <li className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New employees need to be notified to set their schedules
              </li>
            </ul>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Employee Availability Cards */}
        <div className="grid grid-cols-1 gap-6">
          {getFilteredEmployees().map((employee) => (
            <div
              key={employee._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {employee.userId?.fname} {employee.userId?.lname}
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                    {employee.userId?.role}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daysOfWeek
                    .filter((day) => day !== "All" && employee[day] && employee[day].length > 0)
                    .map((day) => (
                      <div key={day} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">{day}</h3>
                        <div className="space-y-2">
                          {employee[day].map((slot, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                            >
                              <div className="flex items-center">
                                <svg
                                  className="h-4 w-4 text-gray-400 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  slot.available
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {slot.available ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {getFilteredEmployees().length === 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : selectedDay !== "All"
                  ? "No availability set for this day"
                  : "No employee availability data available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAvailability; 