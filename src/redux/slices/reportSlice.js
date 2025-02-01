import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reports: [],
    report: null,
    loading: false,
    error: null,
}

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {

        // Action to handle when the fetch request is pending
        reportPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Action to fetch when req is successfull
        reportSuccess: (state, action) => {
            state.loading = false;
            state.reports = action.payload;
            localStorage.setItem("reports", JSON.stringify(state.reports));

        },
        reportFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        reportByIdSuccess: (state, action) => {
            state.loading = false;
            state.report = action.payload;
        },
        reportCreateSuccess: (state, action) => {
            state.loading = false;
            state.reports.push(action.payload);
        },
        reportUpdateSuccess: (state, action) => {
            state.loading = false;
            state.reports = state.reports.map((report) => report._id === action.payload._id ? action.payload : report)
        }, // Update the Report in the array
        reportDeleteSuccess: (state, action) => {
            state.loading = false;
            state.reports = state.reports.filter((report) => report._id !== action.payload ) // Remove the Report
        }
    }
})

export const {
    reportPending,
    reportSuccess,
    reportFailure,
    reportByIdSuccess,
    reportCreateSuccess,
    reportUpdateSuccess,
    reportDeleteSuccess
} = reportSlice.actions;

export default reportSlice.reducer;