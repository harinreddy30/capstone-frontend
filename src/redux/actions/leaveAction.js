import { createAsyncThunk } from "@reduxjs/toolkit";
import { leavePending, leaveSuccess, leaveFailure } from "../slices/leaveSlice";
import apiClient from "../../api/apiClient";
import { getUserIdFromToken } from "../../utilis/token"; // Import utility


// Thunk for creating a leave request
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

// const createLeaveRequest = (leaveRequest) => async (dispatch) => {
//     try {
//         dispatch(leavePending());

//         const userId = getUserIdFromToken(); // Get userId from token
//         const response = await apiClient.post('/leave/create', {
//             ...leaveRequest,
//             userId, // Add userId to the request body
//         });

//         dispatch(leaveSuccess(response.data));
//     } catch (error) {
//         dispatch(leaveFailure(error.message));
//     }
// };
