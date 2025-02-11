import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    availability: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    },
    // availability: [], // Store all availability data
    loading: false, // Loading state for API Calls
    error: null, // Error messages
}

const availabilitySlice = createSlice({
    name: 'availability',
    initialState,
    reducers: {
        // Action to handle when the request is pending
        availabilityPending: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Action to handle when the request is successfully
        availabilitySuccess: (state, action) => {
            state.loading = false;
            state.availability = action.payload.availability; // Update the availability data
        },
        // Action to handle when the request fails
        availabilityFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Store the error message
            console.log(action.payload)
        },
        // Action to handle when fetching a availability by ID is successful
        availabilityByIdSuccess: (state, action) => {
            state.loading = false;
            state.availability = action.payload; // Store the fetched user by ID
        },
        // Action to handle when creating a availability is successful
        availabilityCreateSuccess: (state, action) => {
            state.loading = false;
            state.availability.push(action.payload.availability); // Add the new user to the users array
        },
        // Action to handle when updating availability is successful
        availabilityUpdateSuccess: (state, action) => {
            // state.loading = false;
            // state.availability = state.availability.map((availability) =>
            //     availability._id === action.payload._id ? action.payload : availability
            // ); // Update the user in the users array
            state.loading = false;
            const updatedAvailability = action.payload.data.availability;

            // Merge updated availability with existing state, ensuring the time slots are updated
            state.availability = {
                ...state.availability,
                ...updatedAvailability, // Merge the updated availability from the response
            };
        },
        // Action to handle when deleting a availability is successful
        availabilityDeleteSuccess: (state, action) => {
            state.loading = false;
            state.availability = state.availability.filter((item) => item._id !== action.payload._id); // Remove deleted availability
        },
        clearAvailability: (state) => {
            state.availability = {
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Saturday: [],
              Sunday: [],
            };
        },
          

    }

})

export const {
    availabilityPending,
    availabilitySuccess,
    availabilityFailure,
    availabilityByIdSuccess, 
    availabilityCreateSuccess, 
    availabilityUpdateSuccess, 
    availabilityDeleteSuccess,
    clearAvailability,
 
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
