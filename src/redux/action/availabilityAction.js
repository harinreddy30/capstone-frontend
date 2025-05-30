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
        
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        console.log('Fetching availability for user:', id);
        
        const response = await apiClient.get(`/api/v1/availability/check/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Availability by ID response:', response.data);
        
        if (response.data) {
            dispatch(availabilityByIdSuccess(response.data));
            return response.data;
        } else {
            throw new Error("No availability data received");
        }
    } catch (error) {
        console.error("Error in getAvailabilityById:", error);
        
        // Handle different error status codes
        if (error.response?.status === 404) {
            dispatch(availabilityFailure("No availability found for this employee"));
        } else if (error.response?.status === 403) {
            // Extract the error message and role information from the response
            const errorData = error.response?.data || {};
            const errorMessage = errorData.message || "Access denied";
            const userRole = errorData.userRole || "unknown";
            const expectedRoles = errorData.expectedRoles || [];
            
            console.log('Access denied details:', {
                currentRole: userRole,
                expectedRoles: expectedRoles
            });
            
            const detailedMessage = `${errorMessage} Current role: ${userRole}. Required roles: ${expectedRoles.join(', ')}`;
            dispatch(availabilityFailure(detailedMessage));
        } else {
            dispatch(availabilityFailure(error.message || "Failed to fetch availability"));
        }
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

        // Format the availability data to match the expected structure
        const formattedAvailability = {
            availability: {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            }
        };

        // Convert the array of slots into the correct format
        availability.forEach(slot => {
            if (slot.day && slot.start_time && slot.end_time) {
                formattedAvailability.availability[slot.day].push({
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    available: slot.available !== false
                });
            }
        });

        console.log("Updating availability with data:", formattedAvailability);

        const response = await apiClient.put(`/api/v1/availability/check/update`, formattedAvailability, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Update Availability Response:", response.data);

        if (response.data) {
            dispatch(availabilityUpdateSuccess(response.data));
            return response.data;
        } else {
            throw new Error("No response data received");
        }

    } catch (error) {
        console.error("Error in updateAvailability:", error);
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            console.error("Error Response Status:", error.response.status);
            dispatch(availabilityFailure(error.response.data.message || "Failed to update availability"));
        } else {
            dispatch(availabilityFailure(error.message));
        }
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

