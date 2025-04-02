import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  swapRequests: [],
  loading: false,
  error: null
};

const swapSlice = createSlice({
  name: 'swapShifts',
  initialState,
  reducers: {
    swapPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    swapSuccess: (state, action) => {
      state.loading = false;
      // If the response has a swapRequests property, use that; otherwise, use the payload directly.
      state.swapRequests = action.payload.swapRequests || action.payload;
      localStorage.setItem("swapRequests", JSON.stringify(state.swapRequests));
    },
    swapFailure: (state, action) => {
      state.loading = false;
      // Keep old swapRequests, just set the error
      state.error = action.payload;
    },
    createSwapSuccess: (state, action) => {
      state.loading = false;
      state.swapRequests.push(action.payload);
    },
    swapUpdateSuccess: (state, action) => {
      state.loading = false;
      const index = state.swapRequests.findIndex(
        (req) => req._id === action.payload._id
      );
      if (index !== -1) {
        state.swapRequests[index] = action.payload;
      }
    },
    swapDeleteSuccess: (state, action) => {
      state.loading = false;
      state.swapRequests = state.swapRequests.filter(
        (req) => req._id !== action.payload
      );
    }
  }
});

export const {
  swapPending,
  swapSuccess,
  swapFailure,
  createSwapSuccess,
  swapUpdateSuccess,
  swapDeleteSuccess
} = swapSlice.actions;

export default swapSlice.reducer;
