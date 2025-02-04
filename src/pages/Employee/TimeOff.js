// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createLeaveRequest } from '../../redux/action/leaveAction';

// const LeaveRequestForm = () => {

//   const [leaveRequest, setLeaveRequest] = useState({
//     startDate: '',
//     endDate: '',
//     reason: '',
//     totalDays: 0,
//     status: 'Pending',
//   });

//   const dispatch = useDispatch(); // Dispatch the action
//   const { loading, error } = useSelector((state) => state.leave);
//   const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

//   // Function to calculate total days between startDate and endDate
//   const calculateTotalDays = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     if (start < end) {
//       const diff = (end - start) / (1000 * 60 * 60 * 24); // Convert difference in milliseconds to days
//       return diff.toFixed(2); // Return total days with 2 decimal precision
//     }
//     return 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const updatedRequest = { ...leaveRequest, [name]: value };

//     if (name === 'startDate' || name === 'endDate') {
//       updatedRequest.totalDays = calculateTotalDays(
//         updatedRequest.startDate,
//         updatedRequest.endDate
//       );
//     }

//     setLeaveRequest(updatedRequest);
//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     const { startDate, endDate, reason } = leaveRequest;

//     // Validation for start date and end date
//     if (new Date(startDate) < new Date()) {
//       alert('Start date cannot be in the past.');
//       return;
//     }

//     if (new Date(startDate) >= new Date(endDate)) {
//       alert('End date must be after the start date.');
//       return;
//     }
    
//     if (!reason.trim()) {
//       alert('Reason for time off is required.');
//       return;
//     }

//     dispatch(createLeaveRequest(leaveRequest));

//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Request Time Off</h2>
//       {loading && <p className="loading">Submitting your request...</p>}
//       {error && <p className="error">Error: {error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block font-semibold mb-2">From:</label>
//           <input
//             type="datetime-local"
//             name="startDate"
//             value={leaveRequest.startDate}
//             min={today + 'T00:00'}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold mb-2">To:</label>
//           <input
//             type="datetime-local"
//             name="endDate"
//             value={leaveRequest.endDate}
//             min={leaveRequest.startDate || today + 'T00:00'}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold mb-2">Total Days:</label>
//           <input
//             type="text"
//             value={leaveRequest.totalDays}
//             disabled
//             readOnly
//             className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold mb-2">Reason:</label>
//           <textarea
//             name="reason"
//             value={leaveRequest.reason}
//             onChange={handleInputChange}
//             placeholder="Enter the reason for your leave request"
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold mb-2">Status:</label>
//           <input
//             type="text"
//             value={leaveRequest.status}
//             disabled
//             readOnly
//             className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LeaveRequestForm;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLeaveRequest, fetchLeaveRequests } from '../../redux/action/leaveAction'; // Assuming you have a fetchLeaveRequests action

const LeaveRequests = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    totalDays: 0,
    status: 'Pending',
  });

  const dispatch = useDispatch();
  const { loading, error, leaveRequests } = useSelector((state) => state.leave);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Fetch all leave requests on component mount
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < end) {
      const diff = (end - start) / (1000 * 60 * 60 * 24); // Convert to days
      return diff.toFixed(2);
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRequest = { ...leaveRequest, [name]: value };

    if (name === 'startDate' || name === 'endDate') {
      updatedRequest.totalDays = calculateTotalDays(updatedRequest.startDate, updatedRequest.endDate);
    }

    setLeaveRequest(updatedRequest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate, reason } = leaveRequest;

    // Validation
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
    setIsFormVisible(false); // Hide form after submission
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Leave Requests</h2>

      {loading && <p className="loading">Fetching leave requests...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="mb-6">
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none"
        >
          {isFormVisible ? 'Cancel' : 'Request Time Off'}
        </button>
      </div>

      {/* Display Leave Request Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">From:</label>
            <input
              type="datetime-local"
              name="startDate"
              value={leaveRequest.startDate}
              min={today + 'T00:00'}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">To:</label>
            <input
              type="datetime-local"
              name="endDate"
              value={leaveRequest.endDate}
              min={leaveRequest.startDate || today + 'T00:00'}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Total Days:</label>
            <input
              type="text"
              value={leaveRequest.totalDays}
              disabled
              readOnly
              className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Reason:</label>
            <textarea
              name="reason"
              value={leaveRequest.reason}
              onChange={handleInputChange}
              placeholder="Enter the reason for your leave request"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Status:</label>
            <input
              type="text"
              value={leaveRequest.status}
              disabled
              readOnly
              className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      )}

      {/* Display All Leave Requests */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Leave Requests</h3>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Total Days</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests && leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-2">{new Date(request.startDate).toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(request.endDate).toLocaleString()}</td>
                <td className="px-4 py-2">{request.totalDays}</td>
                <td className="px-4 py-2">{request.reason}</td>
                <td className="px-4 py-2">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
