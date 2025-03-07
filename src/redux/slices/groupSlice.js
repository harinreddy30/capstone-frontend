import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    currentGroup: null,
    loading: false,
    error: null,
  },
  reducers: {
    groupsPending: (state) => {
      state.loading = true;
    },
    groupsSuccess: (state, action) => {
      state.loading = false;
      state.groups = action.payload;
    },
    currentGroupSet: (state, action) => {
      state.currentGroup = action.payload;
    },
    groupsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  groupsPending,
  groupsSuccess,
  groupsFailure,
  currentGroupSet,
} = groupSlice.actions;

export default groupSlice.reducer;
