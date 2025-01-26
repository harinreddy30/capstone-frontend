import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    leaveRequests: [], // Stores all leave requests
    loading: false,    // Loading state for API calls
    error: null,       // Error messages
}

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        
    }
})