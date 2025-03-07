import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    groups: [],
    onlineUsers: [],
    currentGroup: null,
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        messagesPending: (state) => {
            state.loading = true;
        },
        messagesSuccess: (state, action) => {
            state.loading = false;
            state.messages = action.payload;
        },
        messagesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        sendMessageSuccess: (state, action) => {
            state.messages.push(action.payload); // Add new message to the messages array
        },
        groupJoinSuccess: (state, action) => {
            state.groups.push(action.payload); // Add new group to the groups array
        },
        groupsPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        groupsSuccess: (state, action) => {
            state.groups = action.payload;
            state.loading = false;
        },
        groupsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        onlineUsersUpdate: (state, action) => {
            state.onlineUsers = action.payload;
        },
        currentGroupSet: (state, action) => {
            state.currentGroup = action.payload; // Set the current group after joining
        },
    },
});

export const {
    messagesPending,
    messagesSuccess,
    messagesFailure,
    sendMessageSuccess,
    groupJoinSuccess,
    onlineUsersUpdate,
    currentGroupSet,
    groupsPending, groupsSuccess, groupsFailure
} = chatSlice.actions;

export default chatSlice.reducer;
