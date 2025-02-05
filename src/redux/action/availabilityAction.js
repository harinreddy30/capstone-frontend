import { getUserIdFromToken } from "../../utilis/token";
import {
    availabilityPending,
    availabilitySuccess,
    availabilityFailure,
    availabilityByIdSuccess,
    availabilityCreateSuccess,
    availabilityUpdateSuccess,
    availabilityDeleteSuccess
} from "../slices/availabilitySlice";
import apiClient from "../../api/apiClient";

// Create Availability
export const createAvailabilityRequest = (availabilityRequest) => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        console.log("After pending,", availabilityRequest);

        const payload = { availability: availabilityRequest.availability };
        console.log("Payload being sent:", payload);

        // const token = localStorage.getItem("token");
        // console.log(token);
        
        const response = await apiClient.post("/api/v1/availability", payload);
        console.log("Response received:", response.data);
        
        dispatch(availabilityCreateSuccess(response.data));
        return response.data;

    } catch (error) {
        console.error("Error in createAvailability:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

// Get All Availability
export const getAvailability = () => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        const response = await apiClient.get("/api/v1/availability");
        dispatch(availabilitySuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in getAvailability:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

// Get Availability by ID
export const getAvailabilityById = (id) => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        const response = await apiClient.get(`/api/v1/availability/${id}`);
        dispatch(availabilityByIdSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in getAvailabilityById:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

// Get User's Availability
export const getUserAvailability = (userId) => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        const response = await apiClient.get(`/api/v1/availability/user/${userId}`);
        dispatch(availabilitySuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in getUserAvailability:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

// Update Availability
export const updateAvailability = (id, updateData) => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        const response = await apiClient.put(`/api/v1/availability/${id}`, updateData);
        dispatch(availabilityUpdateSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in updateAvailability:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

// Delete Availability
export const deleteAvailability = () => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        const response = await apiClient.delete("/api/v1/availability");
        dispatch(availabilityDeleteSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in deleteAvailability:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

