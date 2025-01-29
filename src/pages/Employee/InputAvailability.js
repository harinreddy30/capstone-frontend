import React, { useState } from 'react';

const Availability = () => {
  const [availability, setAvailability] = useState({});
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  const saveAvailability = () => {
    for (const day in availability) {
      const daySlots = availability[day];
      for (const slot of daySlots) {
        if (!validateTime(slot.start, slot.end)) {
          alert(`Invalid time range on ${day}: Start time must be earlier than End time.`);
          return;
        }
      }
    }
    console.log('Saved availability:', availability);
    alert('Availability saved successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Set Your Availability</h2>
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 border border-gray-300">Day</th>
            <th className="p-4 border border-gray-300">From</th>
            <th className="p-4 border border-gray-300">To</th>
            <th className="p-4 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day) => (
            <React.Fragment key={day}>
              {(availability[day] || [{ start: '', end: '' }]).map((slot, index) => (
                <tr key={`${day}-${index}`} className="odd:bg-white even:bg-gray-50">
                  {index === 0 && (
                    <td
                      rowSpan={(availability[day] || [{}]).length || 1}
                      className="p-4 border border-gray-300 font-medium text-gray-700 align-middle"
                    >
                      {day}
                      <button
                        className="ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => addTimeSlot(day)}
                      >
                        + Add Slot
                      </button>
                    </td>
                  )}
                  <td className="p-4 border border-gray-300">
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={slot.start || ''}
                      onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                    />
                  </td>
                  <td className="p-4 border border-gray-300">
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={slot.end || ''}
                      onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                    />
                  </td>
                  <td className="p-4 border border-gray-300">
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={clearAvailability}
        >
          Clear All
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={saveAvailability}
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default Availability;
