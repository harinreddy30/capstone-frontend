import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payrolls: [],
    payroll: null,
    loading: false,
    error: null,
    currentPayroll: null,  // To store details for the currently selected payroll (if any)
    totalHoursWorked: [],  // Store the total hours data
    payrollById: {
        data: null,
        loading: false,
        error: null
    }
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
            state.payrollById = {
                data: action.payload,
                loading: false,
                error: null
            };
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

        // Add specific reducers for payrollById
        payrollByIdPending: (state) => {
            state.payrollById.loading = true;
            state.payrollById.error = null;
        },

        payrollByIdSuccess: (state, action) => {
            state.payrollById.loading = false;
            state.payrollById.data = action.payload;
            state.payrollById.error = null;
        },

        payrollByIdFailure: (state, action) => {
            state.payrollById.loading = false;
            state.payrollById.error = action.payload;
            state.payrollById.data = null;
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
    setTotalHoursFailed,
    payrollByIdPending,
    payrollByIdSuccess,
    payrollByIdFailure
} = payrollSlice.actions;

export default payrollSlice.reducer;
