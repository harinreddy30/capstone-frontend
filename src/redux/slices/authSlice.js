import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null, // Retrieve user from localStorage
    token: localStorage.getItem("token") || null, // Try to get the token from localStorage
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
        loginSuccess: (state, action) => { // action is dispatched when the login is successful
            state.user = action.payload.user; // Store/ Save the user object returned from the backend.
            state.loading = false; // Set loading to false when login is successful.
            state.token = action.payload.token;
        },
        loginFailure: (state, action) => {
            state.loading = false; // Set loading to false when login fails.
            state.error = action.payload; // Store the error message.
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token"); // Remove data from localStorage on logout
                     
        },
        // // Action to set token from localStorage (or on app load)
        // setToken: (state, action) => {
        //     state.token = action.payload;
        // }
    },
});

// Export the actions so that we can dispatch them from components.
export const { loginStart, loginSuccess, loginFailure, logout, setToken } = authSlice.actions;

// Export the reducer to be used in the store.
export default authSlice.reducer;

