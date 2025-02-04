import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
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
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateUser: (state, action) => {
            console.log('Updating user in auth slice:', action.payload); // Debug log
            state.user = { ...state.user, ...action.payload };
        },
    },
});

// Export the actions so that we can dispatch them from components.
export const { loginStart, loginSuccess, loginFailure, logout, setToken, setUser, updateUser } = authSlice.actions;

// Export the reducer to be used in the store.
export default authSlice.reducer;

