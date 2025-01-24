import React, { useState } from 'react';
import './TimeOff.css'; // Ensure you style this component appropriately

const LeaveRequestForm = () => {
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0, // Changed to totalDays for clarity
    status: 'Pending',
  });

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Function to calculate total days between startDate and endDate
  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < end) {
      const diff = (end - start) / (1000 * 60 * 60 * 24); // Convert difference in milliseconds to days
      return diff.toFixed(2); // Return total days with 2 decimal precision
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRequest = { ...leaveRequest, [name]: value };

    if (name === 'startDate' || name === 'endDate') {
      updatedRequest.totalDays = calculateTotalDays(
        updatedRequest.startDate,
        updatedRequest.endDate
      );
    }

    setLeaveRequest(updatedRequest);
  };

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

    // Call backend API to submit leave request
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveRequest),
      });

      if (response.ok) {
        alert('Leave request submitted successfully!');
        setLeaveRequest({ startDate: '', endDate: '', reason: '', totalDays: 0, status: 'Pending' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request.');
    }
  };

  return (
    <div className="leave-request-form">
      <h2>Request Time Off</h2>
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
          <input
            type="text"
            value={leaveRequest.totalDays}
            disabled
            readOnly
          />
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
          <input
            type="text"
            value={leaveRequest.status}
            disabled
            readOnly
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
