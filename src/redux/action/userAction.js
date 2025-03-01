import apiClient from '../../api/apiClient';
import { 
    usersPending, 
    usersSuccess, 
    usersFailure, 
    userByIdSuccess, 
    userCreateSuccess, 
    userUpdateSuccess, 
    userDeleteSuccess 
} 
from '../slices/userSlice';

// Fetch all the user
export const fetchAllUsers = () => async (dispatch) => {
    dispatch(usersPending());
    try {
        console.log('Making API request...');
        const response = await apiClient.get("/api/v1/users");
        console.log('API Response:', response.data);
        
        dispatch(usersSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error Fetching Users", error);
        if (error.response?.status === 403) {
            dispatch(usersFailure('You are not authorized to view this data. Please log in again.'));
        } else {
            dispatch(usersFailure(error.response?.data?.message || 'Error fetching users'));
        }
    }
};

// Fetch a user by ID (HR, SuperAdmin)
export const fetchUserById = (userId) => async(dispatch) => {
    dispatch(usersPending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get(`/api/v1/users/${userId}`)
        dispatch(userByIdSuccess(response.data)); // Dispatch success with the user data
    } catch (error) {
        dispatch(usersFailure(error.response?.data || 'Error fetching users')); // Dispatch failure with error message
        console.log("Error Fetching Users", error.message)
    }
}

// Create a User 
export const createUser = (userData) => async (dispatch) => {
    dispatch(usersPending());
    try {
        const response = await apiClient.post("/api/v1/users/create-user", userData);
        console.log("User Created:", response.data); // Debugging

        dispatch(userCreateSuccess(response.data.user)); // Send only the user object

    } catch (error) {
        dispatch(usersFailure(error.response?.data || 'Error creating user'));
        console.log("Error Creating User:", error.message);
    }
};



// Update a user
export const updateUser = (userId, updatedData) => async (dispatch) => {
    dispatch(usersPending());
    try {
        const response = await apiClient.put(`/api/v1/users/${userId}`, updatedData);
        dispatch(userUpdateSuccess(response.data)); // Dispatch success with the updated user data
    } catch (error) {
        dispatch(usersFailure(error.response?.data || 'Error updating user'));
        console.log("Error Updating Users", error.message)
    }
};

// Delete a User
export const DeleteUser = (userId) => async (dispatch) => {
    dispatch(usersPending());
    try {
        const response = await apiClient.delete(`/api/v1/users/${userId}`);
        dispatch(userDeleteSuccess(userId)); // Dispatch success and remove the deleted user from state
    } catch (error) {
        dispatch(usersFailure(error.response?.data || 'Error updating user'));
        console.log("Error Deleting Users", error.message)
    }
};