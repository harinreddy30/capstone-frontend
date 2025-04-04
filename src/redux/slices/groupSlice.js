import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    groupsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    groupsSuccess: (state, action) => {
      state.loading = false;
      state.groups = action.payload;
    },
    groupsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    currentGroupSet: (state, action) => {
      state.currentGroup = action.payload;
    },
    currentGroupFailure: (state, action) => {
      state.currentGroup = null;
      state.error = action.payload;
    },
    currentGroupPending: (state) => {
      state.currentGroup = null;
      state.loading = true;
    },
    groupCreated: (state, action) => {
      state.groups.push(action.payload);  // Add new group to the list
    },
    userAddedToGroup: (state, action) => {
      const { groupId, userId } = action.payload;
      const group = state.groups.find((g) => g._id === groupId);
      if (group && !group.members.includes(userId)) {
        group.members.push(userId);
      }
    
      // Optional: also update currentGroup if it's the same group
      if (state.currentGroup && state.currentGroup._id === groupId) {
        if (!state.currentGroup.members.includes(userId)) {
          state.currentGroup.members.push(userId);
        }
      }
    },
    groupDeleteSuccess: (state, action) => {
      state.loading = false;
      state.groups = state.groups.filter(group => group._id !== action.payload);
    }
  }
});

export const {
  groupsPending,
  groupsSuccess,
  groupsFailure,
  currentGroupSet,
  currentGroupFailure,
  currentGroupPending,
  groupCreated,
  userAddedToGroup,
  groupDeleteSuccess
} = groupSlice.actions;

export default groupSlice.reducer;
