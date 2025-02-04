import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../api/apiClient';
import { 
    leavePending, 
    leaveSuccess, 
    leaveFailure,
    createLeaveSuccess,  
    leaveUpdateSuccess, 
    leaveDeleteSuccess
    
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

      dispatch(createLeaveSuccess(response.data)); // Dispatch success with returned data
    } catch (error) {
      console.log('Error in createLeaveRequest:', error);  // Log the error here
      dispatch(leaveFailure(error.message)); // Dispatch failure with error message
    }
  }
);

// Update leave request status (Approve/Reject)
export const updateLeaveStatus = (leaveId, updatedStatus) => async (dispatch) => {
  dispatch(leavePending()); // Indicate loading state (if needed)
  console.log(updatedStatus)
  try {
      const response = await apiClient.put(`/api/v1/leave/${leaveId}/status`, updatedStatus);

      dispatch(leaveUpdateSuccess(response.data)); // Dispatch success with updated leave request data
  } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating leave request status";
      dispatch(leaveFailure(errorMessage)); // Dispatch failure with better error message
      console.error("Error Updating Leave Request Status:", errorMessage);
  }
};



export const DeleteRequest = (leaveId) => async (dispatch) => {
  dispatch(leavePending());
  try {
      const response = await apiClient.delete(`/api/v1/leave/${leaveId}`);
      dispatch(leaveDeleteSuccess(leaveId)); // Dispatch success and remove the deleted user from state
  } catch (error) {
      dispatch(leaveFailure(error.response?.data || 'Error updating Request'));
      console.log("Error Deleting Request", error.message)
  }
};

export const fetchLeavesByEmployee = () => async (dispatch) => {
  dispatch(leavePending()); // Dispatch the 'pending' state before making the request
  try {
      const response = await apiClient.get("/api/v1/leave/employee");
      dispatch(leaveSuccess(response.data.sites || [])); // Dispatch success action with the fetched data
  } catch (error) {
      dispatch(leaveFailure(error.response?.data || 'Error fetching leaves'));
      console.log("Error Fetching Leave Requests:", error.message);
  }
};

