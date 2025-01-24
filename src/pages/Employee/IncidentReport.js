import React, { useState, useEffect } from 'react';
import './IncidentReport.css'; // Add CSS for styling

const IncidentReportForm = () => {
  const [reportData, setReportData] = useState({
    dateTime: '',
    location: '',
    employeeInvolved: '',
    position: '',
    incidentType: '',
    description: '',
    witnesses: '',
  });

  const [reportedBy, setReportedBy] = useState(''); // Store the name of the user from the token

  useEffect(() => {
    // Fetch user data (e.g., from a token or API)
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token to request header
          },
        });

        if (response.ok) {
          const user = await response.json();
          setReportedBy(user.name); // Set the "Reported By" field
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add "Reported By" field dynamically before submitting
    const finalReport = { ...reportData, reportedBy };

    // Validate required fields
    if (!finalReport.dateTime || !finalReport.description) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalReport),
      });

      if (response.ok) {
        alert('Incident report submitted successfully!');
        setReportData({
          dateTime: '',
          location: '',
          employeeInvolved: '',
          position: '',
          incidentType: '',
          description: '',
          witnesses: '',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report.');
    }
  };

  return (
    <div className="incident-report-container">
      <h2>Incident Report</h2>
      <form className="incident-report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date/Time of Incident:</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={reportData.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={reportData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Reported By:</label>
          <input
            type="text"
            name="reportedBy"
            value={reportedBy}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Employee Involved:</label>
          <input
            type="text"
            name="employeeInvolved"
            value={reportData.employeeInvolved}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={reportData.position}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Incident Type:</label>
          <input
            type="text"
            name="incidentType"
            value={reportData.incidentType}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Description of Incident:</label>
          <textarea
            name="description"
            value={reportData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Witnesses:</label>
          <input
            type="text"
            name="witnesses"
            value={reportData.witnesses}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default IncidentReportForm;
