import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvailability, resetAvailability } from "../../redux/action/availabilityAction";

const Availability = () => {
  const dispatch = useDispatch();
  const availability = useSelector((state) => state.availability.availability);
  const { loading, error } = useSelector((state) => state.availability);

  // Default availability structure
  const [formData, setFormData] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [successMessage, setSuccessMessage] = useState(""); // To show success message after update

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    // Pre-fill form with current availability data if available
    if (availability) {
      setFormData(availability);
    }
  }, [availability]);

  const handleChange = (e, day, index) => {
    const { name, value } = e.target;
    const newAvailability = { ...formData };
    newAvailability[day][index][name] = value; // Update startTime or endTime
    setFormData(newAvailability);
  };

  const handleAddSlot = (day) => {
    const newAvailability = { ...formData };
    newAvailability[day] = [...newAvailability[day], { startTime: "", endTime: "", available: true }];
    setFormData(newAvailability);
  };

  const handleRemoveSlot = (day, index) => {
    const newAvailability = { ...formData };
    newAvailability[day].splice(index, 1);
    setFormData(newAvailability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedAvailability = { availability: {} };

    Object.keys(formData).forEach((day) => {
      if (formData[day].length > 0) {
        formattedAvailability.availability[day] = formData[day].map((slot) => ({
          start_time: slot.startTime,
          end_time: slot.endTime,
          available: true,
        }));
      }
    });

    const response = await dispatch(updateAvailability(formattedAvailability));

    if (response) {
      setSuccessMessage("Your availability has been updated successfully!");
    }
  };

  const handleReset = () => {
    // Reset local state
    setFormData({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });

    // Dispatch reset action
    dispatch(resetAvailability());

    // Clear success message
    setSuccessMessage("Availability has been reset.");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Set Your Availability</h2>

      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
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
                {formData[day].length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 border border-gray-300 text-center text-gray-500">
                      No availability set for {day}
                      <button
                        type="button"
                        className="ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleAddSlot(day)}
                      >
                        + Add Slot
                      </button>
                    </td>
                  </tr>
                ) : (
                  formData[day].map((slot, index) => (
                    <tr key={`${day}-${index}`} className="odd:bg-white even:bg-gray-50">
                      {index === 0 && (
                        <td
                          rowSpan={formData[day].length}
                          className="p-4 border border-gray-300 font-medium text-gray-700 align-middle"
                        >
                          {day}
                          <button
                            type="button"
                            className="ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleAddSlot(day)}
                          >
                            + Add Slot
                          </button>
                        </td>
                      )}
                      <td className="p-4 border border-gray-300">
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={slot.startTime || ""}
                          onChange={(e) => handleChange(e, day, index)}
                          name="startTime"
                        />
                      </td>
                      <td className="p-4 border border-gray-300">
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={slot.endTime || ""}
                          onChange={(e) => handleChange(e, day, index)}
                          name="endTime"
                        />
                      </td>
                      <td className="p-4 border border-gray-300">
                        <button
                          type="button"
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleRemoveSlot(day, index)}
                          disabled={formData[day].length <= 1}
                        >
                          Remove Slot
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={handleReset}
          >
            Reset Availability
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            Save Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default Availability;
