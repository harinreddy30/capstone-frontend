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

    // Render no availability state or error state
    if (error || !availability || Object.keys(availability).every(day => !availability[day]?.length)) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                        <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Availability Set</h2>
                    <p className="text-gray-600 mb-6">Please set your availability to start receiving shift assignments.</p>
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        onClick={() => navigate("/employee/input-availability")}
                    >
                        Set Availability
                    </button>
                </div>
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Employee Availability</h2>
                <div className="space-x-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={() => navigate("/employee/input-availability")}
                    >
                        Update Availability
                    </button>
                </div>
            </div>
            <div>
                {Object.keys(availability).map((day) => {
                    return renderAvailability(day, availability[day]);
                })}
            </div>
        </div>
    );
};

export default AvailabilityPage;
