import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailability } from "../../redux/action/availabilityAction"; // Adjust this path as needed
import { useNavigate } from "react-router-dom";


const AvailabilityPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    // Get availability data from Redux store
    const { availability, loading, error } = useSelector(state => state.availability);

    useEffect(() => {
        // Fetch availability data when component mounts
        dispatch(getAvailability());
    }, [dispatch]);

    // Render loading state
    if (loading) {
        return (
            <div className="text-center py-4">
                <span className="text-lg text-gray-600">Loading availability...</span>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="text-center py-4">
                <span className="text-lg text-red-600">Error: {error}</span>
            </div>
        );
    }

    // Function to format and display availability for each day
    const renderAvailability = (day, slots) => {
        return (
            <div key={day} className="mb-6 p-4 border border-gray-300 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{day}</h3>
                {slots.length > 0 ? (
                    slots.map((slot, index) => (
                        <div key={index} className="mb-2">
                            <p className="text-lg">
                                {slot.start_time} - {slot.end_time}{" "}
                                <span
                                    className={`font-bold ${
                                        slot.available ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    {slot.available ? "(Available)" : "(Not Available)"}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No availability for this day</p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            
            <h2 className="text-3xl font-bold text-center mb-6">Employee Availability</h2>
            <div>
                {Object.keys(availability).map((day) => {
                    return renderAvailability(day, availability[day]);
                })}
            </div>
            <div className="flex justify-center mt-6">
                <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
                        onClick={() => navigate("/employee/input-availability")}
                    >
                    Update Availability
                </button>
            </div>
        </div>
    );
};

export default AvailabilityPage;
