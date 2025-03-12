import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    messagesPending: (state) => {
      state.loading = true;
    },
    messagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    sendMessageSuccess: (state, action) => {
      state.messages.push(action.payload);
    },
    messagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  messagesPending,
  messagesSuccess,
  sendMessageSuccess,
  messagesFailure,
} = messageSlice.actions;

export default messageSlice.reducer;
