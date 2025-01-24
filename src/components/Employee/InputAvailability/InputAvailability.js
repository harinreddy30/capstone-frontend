import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/availability');
      setAvailability(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setLoading(false);
    }
  };

  const handleTimeChange = (day, type, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const saveAvailability = async () => {
    try {
      await axios.post('/api/availability', { availability });
      alert('Availability saved successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability.');
    }
  };

  const deleteAvailability = async () => {
    try {
      await axios.delete('/api/availability');
      setAvailability({});
      alert('Availability deleted successfully!');
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Failed to delete availability.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Set Your Availability</h2>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              <td>
                <input
                  type="time"
                  value={availability[day]?.start || ''}
                  onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  value={availability[day]?.end || ''}
                  onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button onClick={saveAvailability} style={{ marginRight: '10px' }}>
          Save
        </button>
        <button onClick={deleteAvailability}>Delete</button>
      </div>
    </div>
  );
};

export default Availability;
