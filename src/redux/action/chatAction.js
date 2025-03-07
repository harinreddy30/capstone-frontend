import apiClient from '../../api/apiClient'; 
import { 
    messagesPending, 
    messagesSuccess, 
    messagesFailure, 
    sendMessageSuccess, 
    groupJoinSuccess, 
    onlineUsersUpdate, 
    currentGroupSet,
    groupsPending, 
    groupsSuccess, 
    groupsFailure 
} from '../slices/chatSlice';

// Fetch messages for a specific group (with pagination)
export const fetchMessages = (groupId, page = 1, limit = 10) => async (dispatch) => {
    dispatch(messagesPending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get(`/api/v1/chat/messages/${groupId}?page=${page}&limit=${limit}`);
        dispatch(messagesSuccess(response.data.messages)); // Dispatch success action with the fetched messages
    } catch (error) {
        dispatch(messagesFailure(error.response?.data || 'Error fetching messages')); // Dispatch failure with error message
        console.log("Error Fetching Messages", error.message);
    }
};

// Fetch joined groups for the user
export const fetchJoinedGroups = () => async (dispatch) => {
    dispatch(groupsPending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get(`/api/v1/chat/joined-groups`);
        dispatch(groupsSuccess(response.data.groups)); // Dispatch success action with the fetched groups
    } catch (error) {
        dispatch(groupsFailure(error.response?.data || 'Error fetching joined groups'));
        console.log("Error Fetching Joined Groups", error.message);
    }
};

// Send a private message to a user
export const sendPrivateMessage = (message, receiverId) => async (dispatch) => {
    dispatch(messagesPending());
    try {
        const messageData = { receiver: receiverId, message };
        const response = await apiClient.post("/api/v1/messages", messageData);

        dispatch(sendMessageSuccess(response.data)); // Dispatch success with the sent message
    } catch (error) {
        dispatch(messagesFailure(error.response?.data || 'Error sending message'));
        console.log("Error Sending Private Message:", error.message);
    }
};

// Send a group message
export const sendGroupMessage = (message, groupId) => async (dispatch) => {
    dispatch(messagesPending());
    try {
        const messageData = { group: groupId, message };
        const response = await apiClient.post("/api/v1/messages", messageData);

        dispatch(sendMessageSuccess(response.data)); // Dispatch success with the sent group message
    } catch (error) {
        dispatch(messagesFailure(error.response?.data || 'Error sending group message'));
        console.log("Error Sending Group Message:", error.message);
    }
};

// Join a group
export const joinGroup = (groupId) => async (dispatch) => {
    dispatch(messagesPending());
    try {
        const response = await apiClient.put(`/api/v1/chat/groups/join/${groupId}`);
        
        dispatch(groupJoinSuccess(response.data.group)); // Dispatch success with the joined group data
        dispatch(currentGroupSet(response.data.group)); // Set the current group after joining
    } catch (error) {
        dispatch(messagesFailure(error.response?.data || 'Error joining group'));
        console.log("Error Joining Group:", error.message);
    }
};

// Update online users list
export const updateOnlineUsers = (users) => (dispatch) => {
    dispatch(onlineUsersUpdate(users)); // Dispatch the updated list of online users
};

export const fetchGroups = () => async (dispatch) => {
    dispatch(groupsPending());

    try {
        const response = await apiClient.get("/api/v1/chat/groups");
        console.log("Groups Fetched:", response.data); // Debug here
        dispatch(groupsSuccess(response.data));
    } catch (error) {
        dispatch(groupsFailure(error.response?.data?.message || "Failed to fetch groups"));
        console.error("Error Fetching Groups:", error.message);
    }
};
