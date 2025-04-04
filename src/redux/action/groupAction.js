import apiClient from "../../api/apiClient";
import { 
  groupsPending, 
  groupsSuccess, 
  groupsFailure, 
  currentGroupSet, 
  currentGroupFailure,
  currentGroupPending,
  groupCreated,
  userAddedToGroup  
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

export const fetchGroupById = (groupId) => async (dispatch) => {
  dispatch(currentGroupPending()); // Dispatch to show loading state

  try {
      console.log("Fetching group data for groupId:", groupId);
      
      // Make the API request to get group data
      const response = await apiClient.get(`/api/v1/chat/groups/${groupId}`);
      
      console.log('Group API Response:', response.data);
      
      // Dispatch the success action with the received group data
      dispatch(currentGroupSet(response.data));
  } catch (error) {
      console.error('Error fetching group:', error);
      
      // Dispatch failure action in case of an error
      const errorMessage = error.response?.data?.message || "Failed to fetch group data";
      dispatch(currentGroupFailure(errorMessage));
  }
};


// Create Group
export const createGroup = (groupData) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.post("/api/v1/chat/groups", groupData);
    dispatch(groupCreated(response.data)); // Add created group to state
    dispatch(fetchGroups()); // Optionally refresh groups list
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to create group"));
  }
};


// Join a group
export const joinGroup = (groupId, userId) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.put(`/api/v1/chat/groups/join/${groupId}`, { userId });

    dispatch(userAddedToGroup({ groupId, userId }));
    dispatch(fetchGroups()); // Optional: refresh list
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to add user to the group"));
    console.log("Error Joining Group:", error.message);
  }
};

export const removeUserFromGroup = (groupId, userId) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    const response = await apiClient.put(`/api/v1/chat/groups/remove/${groupId}`, { userId });
    
    dispatch(fetchGroupById(groupId)); // Refresh group after removal
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to remove user from group"));
    console.log("Error Removing User:", error.message);
  }
};

// Delete Group
export const deleteGroup = (groupId) => async (dispatch) => {
  dispatch(groupsPending());
  try {
    await apiClient.delete(`/api/v1/chat/groups/${groupId}`);
    dispatch(fetchGroups()); // Refresh the list after deletion
  } catch (error) {
    dispatch(groupsFailure(error.response?.data || "Failed to delete group"));
  }
};


  