import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { createAvailabilityRequest } from "../../redux/actions/availabilityAction";
import '../InputAvailability/InputAvailability.css'

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  console.log(availability)
  const dispatch = useDispatch();


  const handleTimeChange = (day, index, type, value) => {
    setAvailability((prev) => {
      const daySlots = prev[day] || [];
      daySlots[index] = {
        ...daySlots[index],
        [type]: value,
      };
      return { ...prev, [day]: daySlots };
    });
  };

  const addTimeSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { start: '', end: '' }],
    }));
  };

  const removeTimeSlot = (day, index) => {
    setAvailability((prev) => {
      const daySlots = [...(prev[day] || [])];
      if (daySlots.length > 1) {
        daySlots.splice(index, 1);
      }
      return { ...prev, [day]: daySlots };
    });
  };

  const validateTime = (start, end) => {
    return !start || !end || start < end;
  };

  const clearAvailability = () => {
    setAvailability({});
  };

  const saveAvailability = (e) => {
    e.preventDefault();
  
    // Validate the availability time ranges
    for (const day in availability) {
      const daySlots = availability[day];
      for (const slot of daySlots) {
        if (!validateTime(slot.start, slot.end)) {
          alert(`Invalid time range on ${day}: Start time must be earlier than End time.`);
          return;
        }
      }
    }
  
    // Transform the `availability` object into the desired format
    const formattedAvailability = {
      availability: Object.entries(availability).flatMap(([day, slots]) =>
        slots.map((slot) => ({
          day,
          startTime: slot.start,
          endTime: slot.end,
        }))
      ),
    };
  
    console.log("Formatted availability:", formattedAvailability); // Log the formatted structure
  

    dispatch(createAvailabilityRequest(formattedAvailability));
    // Dispatch the Redux action with the transformed data
    // dispatch(createAvailabilityRequest(formattedAvailability));
  };
  

  return (
    <div className="availability-container">
      <h2>Set Your Availability</h2>
      <table className="availability-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>From</th>
            <th>To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <React.Fragment key={day}>
              {(availability[day] || [{ start: '', end: '' }]).map((slot, index) => (
                <tr key={`${day}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={(availability[day] || [{}]).length || 1}>
                      {day}
                      <button className="add-slot-button" onClick={() => addTimeSlot(day)}>
                        + Add Slot
                      </button>
                    </td>
                  )}
                  <td>
                    <input
                      type="time"
                      value={slot.start || ''}
                      onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={slot.end || ''}
                      onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="remove-slot-button"
                      onClick={() => removeTimeSlot(day, index)}
                      disabled={(availability[day]?.length || 1) <= 1}
                    >
                      Remove Slot
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="availability-buttons">
        <button className="clear-button" onClick={clearAvailability}>
          Clear All
        </button>
        <button className="save-button" onClick={saveAvailability}>
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default Availability;
