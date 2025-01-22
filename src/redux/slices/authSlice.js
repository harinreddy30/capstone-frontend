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
            state.loading = tru
        }
    }
})