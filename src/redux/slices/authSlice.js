import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Initially, no user is logged in.
    loading: false, // Indicates if the login request is in progress.
    error: null, // Holds any error messages.
}

// Slice consists of name, initial state, and reducers
const authSlice = createSlice({
    name : 'auth', // Name of this slice of state.
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true; // When the starts, set loading to true
            state.error = null; // Clear previous error
        },
        loginSuccess: (state, action) => {
            state.user = action.payload; // Store the user object returned from the backend.
            state.loading = false; // Set loading to false when login is successful.
        },
        loginFailure: (state, action) => {
            state.loading = false; // Set loading to false when login fails.
            state.error = action.payload; // Store the error message.
        },
        logout: (state) => {
            state.user = null; // Clear user data on logout.
        },
    },
});

// Export the actions so that we can dispatch them from components.
