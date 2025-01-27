import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeaveRequest } from '../../redux/actions/leaveAction';

import './TimeOff.css';

const LeaveRequestForm = () => {
  // LeaveRequest State 
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0,
    status: 'Pending',
  });

  const dispatch = useDispatch(); // Dispatch the action
  const { loading, error } = useSelector((state) => state.leave);
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Calculate total days between startDate and endDate
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < end) {
      const diff = (end - start) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
      return diff.toFixed(2); // Return total days with 2 decimal precision
    }
    return 0;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from event
    const updatedRequest = { ...leaveRequest, [name]: value }; 

    if (name === 'startDate' || name === 'endDate') {
      updatedRequest.totalDays = calculateTotalDays(
        updatedRequest.startDate,
        updatedRequest.endDate
      );
    }

    setLeaveRequest(updatedRequest); // Update the LeaveRequest 
  };

  // Upon Submission, dispatch the createLeaveRequest method
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate, reason } = leaveRequest;

    // Validation for start date and end date
    if (new Date(startDate) < new Date()) {
      alert('Start date cannot be in the past.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert('End date must be after the start date.');
      return;
    }
    if (!reason.trim()) {
      alert('Reason for time off is required.');
      return;
    }

    dispatch(createLeaveRequest(leaveRequest));
  };

  return (
    <div className="leave-request-form">
      <h2>Request Time Off</h2>
      {loading && <p className="loading">Submitting your request...</p>}
      {error && <p className="error">Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={leaveRequest.startDate}
            min={today + 'T00:00'} // Ensure the start date cannot be before today
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={leaveRequest.endDate}
            min={leaveRequest.startDate || today + 'T00:00'} // End date must be after the start date
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Total Days:</label>
          <input type="text" value={leaveRequest.totalDays} disabled readOnly />
        </div>
        <div className="form-group">
          <label>Reason:</label>
          <textarea
            name="reason"
            value={leaveRequest.reason}
            onChange={handleInputChange}
            placeholder="Enter the reason for your leave request"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <input type="text" value={leaveRequest.status} disabled readOnly />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
