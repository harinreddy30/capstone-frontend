import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // Import useLocation
import {
  fetchUserSwapRequests,
  createSwapRequest,
  deleteSwapRequest
} from '../../redux/action/swapShiftAction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SwapShift = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Retrieve navigation state
  const { swapRequests, loading, error } = useSelector((state) => state.swaps);

  // Pre-fill "Your Shift ID" if navigated from MySchedule; otherwise, default to an empty string.
  const initialShiftId = location.state?.yourShiftId || '';

  // Set the form to be hidden by default.
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shiftId1: initialShiftId,
    shiftId2: '',
    date: '',
  });

  useEffect(() => {
    dispatch(fetchUserSwapRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'object' && error.error ? error.error : error;
      toast.error(errorMessage);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedData = {
      shiftId1: formData.shiftId1.replace(/\s+/g, ''),
      shiftId2: formData.shiftId2.replace(/\s+/g, ''),
      date: formData.date,
    };

    try {
      await dispatch(createSwapRequest(cleanedData)).unwrap();
      toast.success('Swap request submitted successfully!');
      setFormData({ shiftId1: '', shiftId2: '', date: '' });
      setShowForm(false);
      dispatch(fetchUserSwapRequests());
    } catch (err) {
      console.error('Error submitting swap request:', err);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this swap request?')) {
      try {
        await dispatch(deleteSwapRequest(requestId)).unwrap();
        toast.success('Swap request deleted successfully!');
        dispatch(fetchUserSwapRequests());
      } catch (err) {
        console.error('Error deleting swap request:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Swap Shift Requests
        </h2>

        {loading && swapRequests.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Loading swap requests...</p>
        ) : (
          <div className="overflow-x-auto">
            {swapRequests && swapRequests.length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4 border font-semibold text-gray-700">Your Shift ID</th>
                    <th className="py-3 px-4 border font-semibold text-gray-700">Target Shift ID</th>
                    <th className="py-3 px-4 border font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 border font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 border font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {swapRequests.map((req, index) => (
                    <tr
                      key={req._id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
                    >
                      <td className="py-2 px-4 border">{req.shiftId1}</td>
                      <td className="py-2 px-4 border">{req.shiftId2}</td>
                      <td className="py-2 px-4 border">{new Date(req.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border capitalize">{req.status}</td>
                      <td className="py-2 px-4 border">
                        {req.status === 'pending' && (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded transition transform hover:scale-105"
                            onClick={() => handleDelete(req._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center mt-4 text-gray-600">No swap requests found.</p>
            )}
          </div>
        )}

        {/* Toggle Form Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-200"
            onClick={() => setShowForm(prev => !prev)}
          >
            {showForm ? 'Hide Request Form' : 'New Swap Request'}
          </button>
        </div>

        {/* New Swap Request Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">New Swap Request</h3>
            <div className="mb-5">
              <label className="block font-semibold text-gray-700 mb-2" htmlFor="shiftId1">
                Your Shift ID:
              </label>
              <input
                type="text"
                id="shiftId1"
                name="shiftId1"
                value={formData.shiftId1}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter your shift ID"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block font-semibold text-gray-700 mb-2" htmlFor="shiftId2">
                Target Shift ID:
              </label>
              <input
                type="text"
                id="shiftId2"
                name="shiftId2"
                value={formData.shiftId2}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter target shift ID"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2" htmlFor="date">
                Date:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition duration-200"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default SwapShift;
