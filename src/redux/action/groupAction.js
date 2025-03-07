import apiClient from "../../api/apiClient";
import { 
  groupsPending, 
  groupsSuccess, 
  groupsFailure, 
  currentGroupSet 
} from "../slices/groupSlice";

// Fetch all Groups
export const fetchGroups = () => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.get("/api/v1/chat/groups");
    dispatch(groupsSuccess(response.data));
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to fetch groups"));
  }
};

// Fetch User's Joined Groups
export const fetchUserGroups = () => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.get("/api/v1/chat/user-groups");
    console.log("API response:", response.data); // Log API response for verification

    dispatch(groupsSuccess(response.data || [])); // Directly use response.data
} catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to fetch user's groups"));
  }
};

// Create Group
export const createGroup = (groupData) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.post("/api/v1/chat/groups", groupData);
    dispatch(fetchGroups()); // Refresh the groups list after creating
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to create group"));
  }
};

// Join Group
export const joinGroup = (groupId) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.put(`/api/v1/chat/groups/join/${groupId}`);
    dispatch(currentGroupSet(response.data.group));
    dispatch(fetchUserGroups()); // Refresh user's joined groups list
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to join group"));
  }
};

// Add User to Group
export const addUserToGroup = (groupId, userId) => async (dispatch) => {
    dispatch(groupsPending());
    try {
      const response = await apiClient.post("/api/v1/chat/groups/add-user", { groupId, userId });
      dispatch(fetchGroups()); // Refresh the groups list after adding user
    } catch (error) {
      dispatch(groupsFailure(error.response?.data || "Failed to add user to the group"));
    }
};
  