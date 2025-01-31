// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { leavePending, leaveSuccess, leaveFailure } from "../slices/leaveSlice";
// import apiClient from "../../api/apiClient";
// import { getUserIdFromToken } from "../../utilis/token"; // Import utility


// // Thunk for creating a leave request

// // const createLeaveRequest = (leaveRequest) => async (dispatch) => {
// //     try {
// //         dispatch(leavePending());
// //         const userId = getUserIdFromToken(); // Get userId from token
// //         const response = await apiClient.post('/leave/create', {
// //             ...leaveRequest,
// //             userId, // Add userId to the request body
// //         });
// //         dispatch(leaveSuccess(response.data));
// //     } catch (error) {
// //         dispatch(leaveFailure(error.message));
// //     }
// // };
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../api/apiClient';
import { 
    leavePending, 
    leaveSuccess, 
    leaveFailure,  
    leaveUpdateSuccess, 
    
} from '../slices/leaveSlice';
import { getUserIdFromToken } from "../../utilis/token"; // Import utility

// Fetch all leave requests
export const fetchLeaveRequests = () => async (dispatch) => {
    dispatch(leavePending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get("/api/v1/leave");
        
        dispatch(leaveSuccess(response.data)); // Dispatch success action with the fetched data
    } catch (error) {
        dispatch(leaveFailure(error.response?.data || 'Error fetching leave requests'));
        console.log("Error Fetching Leave Requests:", error.message);
    }
};


// Create a new leave request
export const createLeaveRequest = createAsyncThunk(
  "leave/createLeaveRequest",
  async (requestData, { dispatch }) => {
    try {
      dispatch(leavePending()); // Set loading to true
      const userId = getUserIdFromToken(); // Get userId from token

      // Prepare the payload
      const payload = { ...requestData, userId };
      const response = await apiClient.post("/api/v1/leave/create", payload );
      console.log('Leave request response:', response.data); // Log response data
      dispatch(leaveSuccess(response.data)); // Dispatch success with returned data
    } catch (error) {
      console.log('Error in createLeaveRequest:', error);  // Log the error here
      dispatch(leaveFailure(error.message)); // Dispatch failure with error message
    }
  }
);

// Update leave request status (Approve/Reject)
export const updateLeaveStatus = (leaveId, updatedStatus) => async (dispatch) => {
    dispatch(leavePending());
    try {
        const response = await apiClient.put(`/api/v1/leave/${leaveId}/status`, { status: updatedStatus });
        dispatch(leaveUpdateSuccess(response.data)); // Dispatch success with the updated leave request data
    } catch (error) {
        dispatch(leaveFailure(error.response?.data || 'Error updating leave request status'));
        console.log("Error Updating Leave Request Status:", error.message);
    }
};

