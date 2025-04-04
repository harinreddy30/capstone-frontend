import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shifts: JSON.parse(localStorage.getItem("shifts")) || [],
    loading: false,
    error: null,
}

const shiftSlice = createSlice({
    name: "shifts",
    initialState,
    reducers: {

        // Start loading state
        fetchShiftsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Set shifts data
        fetchShiftsSuccess: (state, action) => {
            state.loading = false;
            state.shifts = action.payload;
            localStorage.setItem("shifts", JSON.stringify(state.shifts));
        },
        // Handle error
        fetchShiftsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Add New Shift
        addShiftSuccess: (state, action) => {
            state.loading = false;
            state.shifts.push(action.payload);
        },
        shiftByIdSuccess: (state, action) => {
            console.log("Shift payload:", action.payload);
            state.loading = false;
            const shift = action.payload; // assuming payload is the shift object
            state.data = {
              ...state.data,
              [shift._id]: shift,
            };
          },

        shiftFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Update Shift     
        updateShiftSuccess: (state, action) => {
            state.loading = false;
            state.shifts = state.shifts.map((shift) => 
                shift._id === action.payload._id ? action.payload : shift
            ); // Update the Shift in shift array
        },
        deleteShiftSuccess: (state, action) => {
            state.shifts = state.shifts.filter((shift) => shift._id !== action.payload)
        },
        clearShifts: (state) => {
            state.shifts = [];
        }
    }
})

export const {
    fetchShiftsStart,
    fetchShiftsSuccess,
    fetchShiftsFailure,
    addShiftSuccess,
    updateShiftSuccess,
    deleteShiftSuccess,
    clearShifts,
    shiftByIdSuccess,
    shiftFailure
} = shiftSlice.actions;

export default shiftSlice.reducer;
