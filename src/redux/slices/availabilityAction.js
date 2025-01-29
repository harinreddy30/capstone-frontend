import { getUserIdFromToken } from "../../utilis/token";
import {
    availabilityPending,
    availabilitySuccess,
    availabilityFailure,
} from "../slices/availabilitySlice";
import apiClient from "../../api/apiClient";

export const createAvailabilityRequest = (availabilityRequest) => async (dispatch) => {
    try {
        dispatch(availabilityPending());

        console.log("After pending,",availabilityRequest)
        
        const userId = getUserIdFromToken() // Get the userId from the token
        console.log(userId)

        // Prepare the payload for the API call
        const payload = { availability: availabilityRequest.availability };
        console.log("Payload being sent:", payload);

        const token = localStorage.getItem("token"); // Get token from localStorage
        console.log(token)
        const config = {
        headers: {
            Authorization: `Bearer ${token}` // Pass token as Bearer
        }
        };
        console.log(config)


        const response = await apiClient.post("/api/v1/availability", payload, config)
        console.log("Payload being sent:", {
            userId,
            availabilityRequest,
          });
          

        dispatch(availabilitySuccess(response.data));

    } catch (error) {
        console.error("Error in createAvailability:", error); // Log the error
        dispatch(availabilityFailure(error.message));
        return null; // Return null to indicate failure

    }
}

