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

        const token = localStorage.getItem("token");
        console.log(token);
        
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

        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        console.log('Fetching availability with token:', token);
        
        const response = await apiClient.get("/api/v1/availability", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.data) {
            throw new Error("No availability data received from server");
        }

        console.log('Availability data received:', response.data);
        dispatch(availabilitySuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in getAvailability:", error);
        // Check if the error is due to unauthorized access
        if (error.response?.status === 403) {
            dispatch(availabilityFailure("Access denied. Only managers can view all employee availability."));
        } else if (error.response?.status === 404) {
            dispatch(availabilityFailure("No availability data found for any employees"));
        } else {
            dispatch(availabilityFailure(error.response?.data?.message || "Failed to fetch availability data"));
        }
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

// Update Availability
export const updateAvailability = (availability) => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        console.log("Token found:", token);

        const response = await apiClient.put(`/api/v1/availability/check/update`, availability, {
            headers: {
                Authorization: `Bearer ${token}`, // Send token with request
            },
        });

        console.log("Update Availability Response:", response.data);

        dispatch(availabilityUpdateSuccess(response.data));
        return response.data;

    } catch (error) {
        // Log detailed error for better debugging
        console.error("Error in updateAvailability:", error);

        if (error.response) {
            // If the error has a response (e.g., 403 Forbidden), log it
            console.error("Error Response Data:", error.response.data);
            console.error("Error Response Status:", error.response.status);
        }

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

// Clear Availability from Backend (DELETE request to API)
export const resetAvailability = () => async (dispatch) => {
    try {
        dispatch(availabilityPending());
        
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await apiClient.put("/api/v1/availability/reset", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        dispatch(availabilityDeleteSuccess(response.data)); // Assuming response.data is the cleared data or confirmation
        return response.data;
    } catch (error) {
        console.error("Error in clearAvailabilityFromBackend:", error);
        dispatch(availabilityFailure(error.message));
        return null;
    }
};

