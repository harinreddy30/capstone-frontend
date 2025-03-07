import apiClient from "../../api/apiClient";
import { messagesPending, messagesSuccess, sendMessageSuccess, messagesFailure } from "../slices/messageSlice";

export const fetchMessages = (groupId) => async (dispatch) => {
  dispatch(messagesPending());
  try {
    const response = await apiClient.get(`/api/v1/chat/messages/${groupId}`);
    dispatch(messagesSuccess(response.data.messages));
  } catch (error) {
    dispatch(messagesFailure(error.response?.data || "Error fetching messages"));
  }
};
