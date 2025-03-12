import apiClient from "../../api/apiClient";
import { messagesPending, messagesSuccess, sendMessageSuccess, messagesFailure } from "../slices/messageSlice";
import socket from '../../utilis/socket'; // Ensure the socket connection is correctly set up

// Fetch messages for a specific group (with pagination)
export const fetchMessages = (groupId, page = 1, limit = 10) => async (dispatch) => {
    dispatch(messagesPending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get(`/api/v1/chat/messages/${groupId}?page=${page}&limit=${limit}`);
        dispatch(messagesSuccess(response.data.messages)); // Dispatch success action with the fetched messages
    } catch (error) {
        // Handle error appropriately
        const errorMessage = error.response?.data || error.message || 'Error fetching messages';
        dispatch(messagesFailure(errorMessage)); // Dispatch failure with error message
        console.error("Error Fetching Messages:", errorMessage);
    }
};

// Send a group message with real-time update
export const sendGroupMessage = (message, groupId) => async (dispatch) => {
    dispatch(messagesPending());
    try {
        const messageData = { groupId, message };
        const response = await apiClient.post("/api/v1/chat/messages", messageData);

        // Dispatch success action with the sent group message
        dispatch(sendMessageSuccess(response.data));

        // Emit to the group via Socket.io for real-time updates
        socket.emit("sendMessage", {
            message: response.data.message,
            groupId,
            sender: response.data.sender,
            timestamp: response.data.timestamp,
        });
    } catch (error) {
        // Handle error appropriately
        const errorMessage = error.response?.data || error.message || 'Error sending group message';
        dispatch(messagesFailure(errorMessage));
        console.error("Error Sending Group Message:", errorMessage);
    }
};

// Send a private message with real-time update
export const sendPrivateMessage = (message, receiverId) => async (dispatch) => {
    dispatch(messagesPending());
    try {
        const messageData = { receiver: receiverId, message };
        const response = await apiClient.post("/api/v1/messages", messageData);

        // Dispatch success with the sent private message
        dispatch(sendMessageSuccess(response.data));

        // Emit private message to the receiver via Socket.io for real-time updates
        socket.emit("privateMessage", {
            message: response.data.message,
            receiverId,
            sender: response.data.sender,
            timestamp: response.data.timestamp,
        });
    } catch (error) {
        // Handle error appropriately
        const errorMessage = error.response?.data || error.message || 'Error sending private message';
        dispatch(messagesFailure(errorMessage));
        console.error("Error Sending Private Message:", errorMessage);
    }
};

// Update the online users list (Optional - Depending on the use case)
// export const updateOnlineUsers = (users) => (dispatch) => {
//     dispatch(onlineUsersUpdate(users)); // Dispatch the updated list of online users
// };
