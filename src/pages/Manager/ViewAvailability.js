import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailabilityById } from "../../redux/action/availabilityAction";
import { fetchAllUsers } from "../../redux/action/userAction";

const ViewAvailability = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { availability, loading: availabilityLoading, error: availabilityError } = useSelector((state) => state.availability);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userAvailabilities, setUserAvailabilities] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleViewAvailability = async (userId) => {
    try {
      // If already showing this user's availability, hide it
      if (selectedUserId === userId && userAvailabilities[userId]) {
        setSelectedUserId(null);
        return;
      }

      setSelectedUserId(userId);
      setErrors(prev => ({ ...prev, [userId]: null }));
      
      console.log('Fetching availability for user:', userId);
      const result = await dispatch(getAvailabilityById(userId));
      
      if (result) {
        console.log('Received availability:', result);
        setUserAvailabilities(prev => ({
          ...prev,
          [userId]: result.availability || result
        }));
      } else {
        // Check if there's an error in the Redux state
        const errorMessage = availabilityError || "No availability data found";
        setErrors(prev => ({
          ...prev,
          [userId]: errorMessage
        }));
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setErrors(prev => ({
        ...prev,
        [userId]: error.message || "Failed to fetch availability"
      }));
    }
  };

  const formatTime = (timeStr) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return timeStr;
    }
  };

  // Filter users to only show employees by excluding managers, payroll managers, and HR
  const filteredUsers = users?.filter(user => {
    if (!user || !user.fname || !user.lname) return false;

    // List of roles to exclude
    const excludedRoles = ["manager", "payrollmanager", "hr"];
    // If the user has a role and it matches one of the excluded roles, don't include them
    if (user.role && excludedRoles.includes(user.role.toLowerCase())) {
      return false;
    }

    const fullName = `${user.fname} ${user.lname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  }) || [];

  // Get user's availability from the global availability state
  const getUserAvailability = (userId) => {
    if (!availability || !Array.isArray(availability)) return null;
    return availability.find(a => a.userId === userId)?.availability || null;
  };

  // Check if user has any availability slots
  const hasAvailability = (userAvailability) => {
    if (!userAvailability) return false;
    return Object.values(userAvailability).some(slots => Array.isArray(slots) && slots.length > 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Availability</h1>
            <p className="mt-2 text-sm text-gray-600">View employee availability schedules</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
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
        </div>

        {/* Loading State */}
        {(usersLoading || availabilityLoading) && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {availabilityError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{availabilityError}</p>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => {
            const userAvailability = userAvailabilities[user._id];
            const userHasAvailability = hasAvailability(userAvailability);

            return (
              <div
                key={user._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.fname} {user.lname}
                      </h2>
                      <p className="text-sm text-gray-500">Employee ID: {user.employeeId}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewAvailability(user._id)}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          selectedUserId === user._id
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {availabilityLoading && selectedUserId === user._id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                          </span>
                        ) : selectedUserId === user._id ? (
                          "Hide Availability"
                        ) : (
                          "View Availability"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors[user._id] && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{errors[user._id]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Section */}
                  {selectedUserId === user._id && userAvailability && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(userAvailability).map(([day, slots]) => {
                        if (!Array.isArray(slots) || slots.length === 0) return null;
                        
                        return (
                          <div key={day} className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">{day}</h3>
                            <div className="space-y-2">
                              {slots.map((slot, index) => (
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
                        );
                      })}
                    </div>
                  )}

                  {/* No Availability Message */}
                  {selectedUserId === user._id && !userHasAvailability && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">No availability set for this employee.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {!usersLoading && filteredUsers.length === 0 && (
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
                {searchTerm ? "Try adjusting your search terms" : "No employees available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAvailability;
