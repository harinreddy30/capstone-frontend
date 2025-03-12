import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSchedule, getAllSchedules } from '../../redux/action/scheduleAction';
import { fetchAllUsers } from '../../redux/action/userAction';
import { fetchAllSites } from '../../redux/action/siteAction';
import { fetchShifts } from '../../redux/action/shiftAction';
import { getAvailabilityById } from '../../redux/action/availabilityAction';
import './AssignShift.css';

const AssignShift = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedShift, setSelectedShift] = useState(null);
  const [error, setError] = useState(null);
  const [shiftDetails, setShiftDetails] = useState({
    startTime: '09:00',
    endTime: '17:00',
    notes: '',
    close: false,
    bd: false,
  });

  // Get data from Redux store
  const { users, loading: usersLoading, error: userError } = useSelector((state) => state.users);
  const { schedules = [] } = useSelector((state) => state.schedule || { schedules: [] });
  const { user: currentUser } = useSelector((state) => state.auth);
  const { sites = [], loading: sitesLoading } = useSelector((state) => state.sites);
  const { shifts = [], loading: shiftsLoading } = useSelector((state) => state.shifts);
  const availabilityState = useSelector((state) => state.availability);

  // Memoize filtered employees to prevent unnecessary recalculations
  const employees = useMemo(() => 
    users?.filter(user => user.role === 'Employee') || [], 
    [users]
  );

  // Get the day name for the selected date
  const selectedDayName = useMemo(() => 
    selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
    [selectedDate]
  );

  // Helper function to compare times that might cross midnight
  const isTimeSlotAvailable = (slot, shiftStart, shiftEnd) => {
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const slotStart = parseTime(slot.start_time);
    const slotEnd = slot.end_time === '00:00' ? 1440 : parseTime(slot.end_time);
    const start = parseTime(shiftStart);
    const end = shiftEnd === '00:00' ? 1440 : parseTime(shiftEnd);

    // For debugging
    console.log('Comparing times:', {
      slot: `${slot.start_time}-${slot.end_time}`,
      shift: `${shiftStart}-${shiftEnd}`,
      slotStart,
      slotEnd,
      start,
      end,
      available: slot.available
    });

    // Must be an available slot
    if (!slot.available) return false;

    // Case 1: Exact match
    if (slotStart === start && slotEnd === end) return true;

    // Case 2: Shift is within slot
    if (slotStart <= start && slotEnd >= end) return true;

    // Case 3: Shift crosses midnight
    if (end < start) {
      // Split into two parts: start to midnight, and midnight to end
      const beforeMidnight = slotStart <= start && slotEnd === 1440;
      const afterMidnight = slotStart === 0 && slotEnd >= end;
      return beforeMidnight || afterMidnight;
    }

    return false;
  };

  // Get employee availability
  const getEmployeeAvailability = (employeeId, day) => {
    console.log('Getting availability for day:', day);
    console.log('Full availability state:', availabilityState);
    
    if (!availabilityState?.availability?.availability?.[day]) {
      console.log('No availability data for day:', day);
      return [];
    }
    
    const dayAvailability = availabilityState.availability.availability[day] || [];
    console.log('Found availability for day:', dayAvailability);
    return dayAvailability;
  };

  // Fetch availability when employee is selected
  useEffect(() => {
    const fetchEmployeeAvailability = async () => {
      if (selectedEmployee) {
        console.log('Fetching availability for employee:', selectedEmployee);
        try {
          const result = await dispatch(getAvailabilityById(selectedEmployee));
          console.log('Availability fetch result:', result);
        } catch (error) {
          console.error('Error fetching availability:', error);
        }
      }
    };
    fetchEmployeeAvailability();
  }, [dispatch, selectedEmployee]);

  // Filter shifts based on site, day, and availability
  const getAvailableShifts = useMemo(() => {
    if (!selectedSite || !shifts.length) return [];

    console.log('Filtering shifts for site:', selectedSite);
    console.log('Selected day:', selectedDayName);

    // Get all shifts for the selected site
    const siteShifts = shifts.filter(shift => shift.site._id === selectedSite);
    console.log('Site shifts:', siteShifts);

    // Filter shifts based on the day
    const dayShifts = siteShifts.filter(shift => shift.days.includes(selectedDayName));
    console.log('Day shifts:', dayShifts);

    // If no employee selected, return all unassigned shifts
    if (!selectedEmployee) {
      console.log('No employee selected, returning all shifts');
      return dayShifts;
    }

    // Get employee availability
    const employeeAvailability = getEmployeeAvailability(selectedEmployee, selectedDayName);
    console.log('Raw availability state:', availabilityState);
    console.log('Employee ID:', selectedEmployee);
    console.log('Employee availability for', selectedDayName, ':', employeeAvailability);
    
    return dayShifts.map(shift => {
      const isAvailable = employeeAvailability.some(slot => {
        const available = isTimeSlotAvailable(slot, shift.startTime, shift.endTime);
        console.log(`Checking availability for shift ${shift.position}:`, {
          slot,
          shiftTime: `${shift.startTime}-${shift.endTime}`,
          available
        });
        return available;
      });

      return {
        ...shift,
        isAvailable
      };
    });
  }, [selectedSite, shifts, selectedDayName, selectedEmployee, availabilityState]);

  // Get available employees for a shift
  const getAvailableEmployees = useMemo(() => {
    if (!selectedShift) return employees;

    return employees.filter(employee => {
      const employeeAvailability = getEmployeeAvailability(employee._id, selectedDayName);
      return employeeAvailability.some(slot => 
        isTimeSlotAvailable(slot, selectedShift.startTime, selectedShift.endTime)
      );
    });
  }, [employees, selectedShift, selectedDayName, availabilityState]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && ['Manager', 'HR', 'SuperAdmin', 'PayrollManager'].includes(currentUser.role)) {
          await Promise.all([
            dispatch(fetchAllUsers()),
            dispatch(getAllSchedules()),
            dispatch(fetchAllSites()),
          ]);
        } else {
          setError('You do not have permission to view this page');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Error fetching data');
      }
    };

    fetchData();
    generateWeekDays(selectedDate);
  }, [dispatch, selectedDate, currentUser]);

  // Fetch shifts when site is selected
  useEffect(() => {
    if (selectedSite) {
      dispatch(fetchShifts(selectedSite));
    }
  }, [dispatch, selectedSite]);

  // Reset selected shift when site changes
  useEffect(() => {
    setSelectedShift(null);
  }, [selectedSite]);

  // Reset selected employee when shift changes
  useEffect(() => {
    setSelectedEmployee('');
  }, [selectedShift]);

  // Add debugging logs
  useEffect(() => {
    console.log('Users data:', users);
    console.log('Filtered employees:', employees);
    console.log('Sites:', sites);
    console.log('Shifts:', shifts);
    console.log('Availability:', availabilityState);
  }, [users, employees, sites, shifts, availabilityState]);

  // Show error message if there's an error
  if (error || userError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || userError}
        </div>
      </div>
    );
  }

  const generateWeekDays = (date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    setCurrentWeek(week);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShiftDetails({
      startTime: '09:00',
      endTime: '17:00',
      notes: '',
      close: false,
      bd: false,
    });
    setSelectedEmployee('');
    setSelectedSite('');
    setSelectedShift(null);
  };

  const calculateTotalHours = (start, end) => {
    const startTime = new Date(`2000/01/01 ${start}`);
    const endTime = new Date(`2000/01/01 ${end}`);
    return ((endTime - startTime) / (1000 * 60 * 60)).toFixed(1); // Convert to hours with 1 decimal
  };

  // Update the isEmployeeAvailable function to use the new helper
  const isEmployeeAvailable = (employee, date, startTime, endTime) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = getEmployeeAvailability(employee._id, dayOfWeek);
    return dayAvailability.some(slot => 
      isTimeSlotAvailable(slot, startTime, endTime)
    );
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedShift) {
      setError('Please select a shift');
      return;
    }

    if (!isEmployeeAvailable(
      employees.find(emp => emp._id === selectedEmployee),
      selectedDate,
      selectedShift.startTime,
      selectedShift.endTime
    )) {
      setError('Employee is not available for this shift');
      return;
    }
    
    const scheduleData = {
      userId: selectedEmployee,
      shiftId: selectedShift._id,
      date: selectedDate,
      day: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
      startTime: selectedShift.startTime,
      endTime: selectedShift.endTime,
      notes: shiftDetails.notes,
      totalHours: calculateTotalHours(selectedShift.startTime, selectedShift.endTime),
      close: shiftDetails.close,
      bd: shiftDetails.bd
    };

    try {
      await dispatch(createSchedule(scheduleData));
      handleModalClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.message || 'Error creating schedule');
    }
  };

  // Function to get shifts for a specific date
  const getShiftsForDate = (date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  // Function to format time for display
  const formatTime = (time) => {
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="assign-shift-container p-6">
      {/* Show any errors at the top of the page */}
      {(error || userError) && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || userError}
        </div>
      )}

      <div className="header flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Assign Shift</h1>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Last published Nov 16, 2024 @ 5:43 PM</span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Publish schedule
          </button>
        </div>
      </div>

      <div className="week-navigation flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={handlePreviousWeek} className="p-2 hover:bg-gray-100 rounded">
            &lt;
          </button>
          <div className="date-range flex items-center gap-2">
            <span className="font-semibold">
              {currentWeek[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              {currentWeek[6]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded">
            &gt;
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Today
          </button>
        </div>
      </div>

      <div className="schedule-grid">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {/* Employee column header */}
          <div className="bg-white p-4 font-semibold">Employees</div>
          
          {/* Days of week headers */}
          {currentWeek.map((date, index) => (
            <div key={index} className="bg-white p-4">
              <div className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-sm text-gray-500">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getShiftsForDate(date).length} shifts
              </div>
            </div>
          ))}

          {/* Employee rows */}
          {usersLoading ? (
            <div className="col-span-8 p-4 text-center">Loading employees...</div>
          ) : (
            employees.map((employee) => (
              <React.Fragment key={employee._id}>
                <div className="bg-white p-4 border-t">
                  <div className="font-medium">{employee.fname} {employee.lname}</div>
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </div>
                {currentWeek.map((date, index) => (
                  <div
                    key={index}
                    className="bg-white border-t p-2 min-h-[100px] relative cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedEmployee(employee._id);
                      setShowModal(true);
                    }}
                  >
                    {getShiftsForDate(date)
                      .filter(shift => shift.userId === employee._id)
                      .map((shift, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-100 text-purple-800 p-2 rounded mb-1 text-sm"
                        >
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                      ))}
                    <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 hover:opacity-100">
                      <span className="text-blue-600">+</span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Create Shift Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-6 rounded-lg w-full max-w-md">
            <div className="modal-header flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Create new shift</h2>
                <p className="text-sm text-gray-500">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <form onSubmit={handleShiftSubmit}>
              {/* Site selection */}
              {!selectedSite && (
                <div className="mb-4">
                  <label className="block mb-2">Site</label>
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Available Shifts */}
              <div className="mb-4">
                <label className="block mb-2">Available Shifts</label>
                <select
                  value={selectedShift ? selectedShift._id : ''}
                  onChange={(e) => {
                    const shift = getAvailableShifts.find(s => s._id === e.target.value);
                    setSelectedShift(shift);
                    setSelectedEmployee('');
                  }}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a shift</option>
                  {getAvailableShifts.map((shift) => {
                    const isAvailable = !selectedEmployee || shift.isAvailable;
                    return (
                      <option 
                        key={shift._id} 
                        value={shift._id}
                        disabled={!isAvailable}
                        style={{ color: isAvailable ? 'black' : '#999' }}
                      >
                        {shift.position} ({shift.startTime} - {shift.endTime})
                        {!isAvailable ? ' - Not Available' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Employee selection */}
              <div className="mb-4">
                <label className="block mb-2">Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select an employee</option>
                  {getAvailableEmployees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.fname} {employee.lname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other form fields */}
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shiftDetails.close}
                      onChange={(e) => setShiftDetails({ ...shiftDetails, close: e.target.checked })}
                      className="rounded"
                    />
                    Close
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shiftDetails.bd}
                      onChange={(e) => setShiftDetails({ ...shiftDetails, bd: e.target.checked })}
                      className="rounded"
                    />
                    BD
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Notes</label>
                <textarea
                  value={shiftDetails.notes}
                  onChange={(e) => setShiftDetails({ ...shiftDetails, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Add notes about this shift..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignShift; 