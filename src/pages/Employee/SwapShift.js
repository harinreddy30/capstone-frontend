import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Import your swap shift actions here
// import { createSwapRequest, fetchSwapRequests } from '../../redux/action/swapShiftAction';

const SwapShift = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const { swapRequests, loading, error } = useSelector((state) => state.swapShifts);

  const [swapForm, setSwapForm] = useState({
    yourShiftId: '',
    targetShiftId: '',
    employeeDetails: '',
    status: 'Pending'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSwapForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatch create swap request action
      // await dispatch(createSwapRequest(swapForm));
      console.log('Swap request submitted:', swapForm);
      alert('Swap request submitted successfully!');
      // Reset form
      setSwapForm({
        yourShiftId: '',
        targetShiftId: '',
        employeeDetails: '',
        status: 'Pending'
      });
    } catch (error) {
      console.error('Error submitting swap request:', error);
      alert('Failed to submit swap request');
    }
  };

  const handleClear = () => {
    setSwapForm({
      yourShiftId: '',
      targetShiftId: '',
      employeeDetails: '',
      status: 'Pending'
    });
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Swap Shifts</h2>
      
      <form className="flex flex-col" onSubmit={handleSubmit}>
        {/* Your Shift ID */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="yourShiftId">
            Your Shift ID:
          </label>
          <input
            type="text"
            id="yourShiftId"
            name="yourShiftId"
            value={swapForm.yourShiftId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded bg-gray-200"
            placeholder="12345"
            disabled
          />
        </div>

        {/* Target Shift ID */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="targetShiftId">
            Target Shift ID:
          </label>
          <input
            type="text"
            id="targetShiftId"
            name="targetShiftId"
            value={swapForm.targetShiftId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter target shift ID"
            required
          />
        </div>

        {/* Details of Employee B */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="employeeDetails">
            Details of Employee B:
          </label>
          <textarea
            id="employeeDetails"
            name="employeeDetails"
            value={swapForm.employeeDetails}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            placeholder="Enter details of the employee you want to swap shift with"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="font-bold mb-2 block" htmlFor="status">
            Status:
          </label>
          <input
            type="text"
            id="status"
            name="status"
            value={swapForm.status}
            className="w-full p-3 border border-gray-300 rounded bg-gray-200"
            disabled
          />
        </div>

        {/* Confirm Request Checkbox */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-bold">Confirm Request</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-500 text-white font-bold text-lg py-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white font-bold text-lg py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SwapShift;