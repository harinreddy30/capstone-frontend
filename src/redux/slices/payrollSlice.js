import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payrolls: [],
    payroll: null,
    loading: false,
    error: null,
    currentPayroll: null,  // To store details for the currently selected payroll (if any)
    totalHoursWorked: [],  // Store the total hours data

};

const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {
        // Actions for handling loading and errors
        payrollPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        payrollSuccess: (state, action) => {
            state.loading = false;
            state.payrolls = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        },
        payrollFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.payrolls = [];
        },

        // Actions for specific payroll operations
        payrollGenerateSuccess: (state, action) => {
            state.loading = false;
            state.payrolls.push(action.payload);  // Adding the newly generated payroll
        },
        payrollUpdateSuccess: (state, action) => {
            state.loading = false;
            state.payrolls = state.payrolls.map(payroll =>
                payroll._id === action.payload._id ? action.payload : payroll
            );  // Updating the specific payroll
        },
        payrollDeleteSuccess: (state, action) => {
            state.loading = false;
            state.payrolls = state.payrolls.filter(payroll => payroll._id !== action.payload);  // Removing the deleted payroll
        },

        // Actions for managing the current payroll being viewed
        setCurrentPayroll: (state, action) => {
            state.currentPayroll = action.payload;  // Setting the currently selected payroll
        },
        resetCurrentPayroll: (state) => {
            state.currentPayroll = null;  // Resetting the current payroll when needed
        },
        totalHoursPending: (state) => {
            state.loading = true;
            state.totalHoursWorked = []; // Clear old data
            state.error = null;
        },        
        setTotalHoursWorked: (state, action) => {
            state.loading = false;
            state.totalHoursWorked = action.payload;
        },
        setTotalHoursFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.totalHoursWorked = [];
        },
        
    }
});

// Exporting the actions
export const {
    payrollPending,
    payrollSuccess,
    payrollFailure,
    payrollGenerateSuccess,
    payrollUpdateSuccess,
    payrollDeleteSuccess,
    setCurrentPayroll,
    resetCurrentPayroll,
    totalHoursPending,
    setTotalHoursWorked,
    setTotalHoursFailed
} = payrollSlice.actions;

export default payrollSlice.reducer;
