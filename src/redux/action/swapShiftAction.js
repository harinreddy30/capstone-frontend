import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";
import {
  swapPending,
  swapSuccess,
  swapFailure,
  createSwapSuccess,
  swapUpdateSuccess,
  swapDeleteSuccess
} from "../slices/swapSlice";
import { getUserIdFromToken } from "../../utilis/token";

// Create Swap Request
export const createSwapRequest = createAsyncThunk(
  "swap/createSwapRequest",
  async (requestData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(swapPending());
      const userId = getUserIdFromToken();
      const payload = { ...requestData, requestedBy: userId };
      const response = await apiClient.post("/api/v1/swap/request", payload);
      dispatch(createSwapSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error in createSwapRequest:", error);
      const errMsg = error.response?.data || "Error creating swap request";
      dispatch(swapFailure(errMsg));
      return rejectWithValue(errMsg);
    }
  }
);

// Fetch all swap requests (for managers)
export const fetchAllSwapRequests = () => async (dispatch) => {
  dispatch(swapPending());
  try {
    const response = await apiClient.get("/api/v1/swap/all");
    console.log("Action Data", response)
    dispatch(swapSuccess(response.data));
  } catch (error) {
    const errMsg = error.response?.data || "Error fetching swap requests";
    dispatch(swapFailure(errMsg));
    console.error("Error fetching swap requests:", error.message);
  }
};

// Fetch swap requests for the logged-in user (for employees)
export const fetchUserSwapRequests = () => async (dispatch) => {
  dispatch(swapPending());
  try {
    const response = await apiClient.get("/api/v1/swap/myrequests");
    dispatch(swapSuccess(response.data));
  } catch (error) {
    const errMsg = error.response?.data || "Error fetching your swap requests";
    dispatch(swapFailure(errMsg));
    console.error("Error fetching user swap requests:", error.message);
  }
};

  
// Approve a swap request
export const approveSwapRequest = (requestId) => async (dispatch) => {
  dispatch(swapPending());
  try {
    const response = await apiClient.post(`/api/v1/swap/approve/${requestId}`);
    dispatch(swapUpdateSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error approving swap request";
    dispatch(swapFailure(errorMessage));
    console.error("Error approving swap request:", errorMessage);
  }
};

// Reject a swap request
export const rejectSwapRequest = (requestId) => async (dispatch) => {
  dispatch(swapPending());
  try {
    const response = await apiClient.post(`/api/v1/swap/reject/${requestId}`);
    dispatch(swapUpdateSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error rejecting swap request";
    dispatch(swapFailure(errorMessage));
    console.error("Error rejecting swap request:", errorMessage);
  }
};

// Delete a swap request
export const deleteSwapRequest = (requestId) => async (dispatch) => {
  dispatch(swapPending());
  try {
    await apiClient.delete(`/api/v1/swap/delete/${requestId}`);
    dispatch(swapDeleteSuccess(requestId));
  } catch (error) {
    const errMsg = error.response?.data || "Error deleting swap request";
    dispatch(swapFailure(errMsg));
    console.error("Error deleting swap request:", error.message);
  }
};
