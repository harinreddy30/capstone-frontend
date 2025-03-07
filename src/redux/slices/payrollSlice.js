import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payrolls: [],
    currentPayroll: null,
    loading: false,
    error: null,
};

const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {
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
        payrollGenerateSuccess: (state, action) => {
            state.loading = false;
            state.payrolls.push(action.payload);
        },
        payrollUpdateSuccess: (state, action) => {
            state.loading = false;
            state.payrolls = state.payrolls.map(payroll => 
                payroll._id === action.payload._id ? action.payload : payroll
            );
        },
        payrollDeleteSuccess: (state, action) => {
            state.loading = false;
            state.payrolls = state.payrolls.filter(payroll => payroll._id !== action.payload);
        },
        setCurrentPayroll: (state, action) => {
            state.currentPayroll = action.payload;
        }
    }
});

export const {
    payrollPending,
    payrollSuccess,
    payrollFailure,
    payrollGenerateSuccess,
    payrollUpdateSuccess,
    payrollDeleteSuccess,
    setCurrentPayroll
} = payrollSlice.actions;

export default payrollSlice.reducer; 