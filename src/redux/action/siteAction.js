import apiClient from '../../api/apiClient';
import {
    sitePending,
    siteSuccess,
    siteFailure,
    siteByIdSucess,
    siteCreateSuccess,
    siteUpdateSuccess,
    siteDeleteSuccess
}
from '../slices/siteSlice';

// Fetch all Sites
export const fetchAllSites = () => async (dispatch) => {
    dispatch(sitePending()); 
    try {
        const response = await apiClient.get("/api/v1/sites")
        dispatch(siteSuccess(response.data.sites)) // Dispatch SUcess action

    } catch (error) {
        dispatch(siteFailure(error.response?.data || 'Error fetching Sites')); // Dispatch failure with error message
        console.log("Error Fetching sites", error.message)
    }
}

// Fetch a Site by ID (HR, SuperAdmin)
export const fetchSiteById = (siteId) => async(dispatch) => {
    dispatch(sitePending()); // Dispatch the 'pending' state before making the request
    try {
        const response = await apiClient.get(`/api/v1/sites/${siteId}`)
        dispatch(siteByIdSucess(response.data)); // Dispatch success with the user data
    } catch (error) {
        dispatch(siteFailure(error.response?.data || 'Error fetching sites')); // Dispatch failure with error message
        console.log("Error Fetching Sites", error.message)
    }
}

// Create a SIte 
export const createSite = (siteData) => async (dispatch) => {
    dispatch(sitePending());
    try {
        const response = await apiClient.post("/api/v1/sites", siteData)
        dispatch(siteCreateSuccess(response.data)); // Dispatch success and add new user to state

    } catch (error) {
        dispatch(siteFailure(error.response?.data || 'Error fetching sites')); // Dispatch failure with error message
        console.log("Error Creating Sites", error.message)
    }
}

// Update a user
export const updateSite = (siteId, updatedData) => async (dispatch) => {
    dispatch(sitePending());
    try {
        const response = await apiClient.put(`/api/v1/sites/${siteId}`, updatedData);
        dispatch(siteUpdateSuccess(response.data)); // Dispatch success with the updated user data
    } catch (error) {
        dispatch(siteFailure(error.response?.data || 'Error updating sites'));
        console.log("Error Updating Sites", error.message)
    }
};

// Delete a User
export const DeleteSite = (siteId) => async (dispatch) => {
    dispatch(sitePending());
    try {
        const response = await apiClient.delete(`/api/v1/sites/${siteId}`);
        dispatch(siteDeleteSuccess(siteId)); // Dispatch success and remove the deleted user from state
    } catch (error) {
        dispatch(siteFailure(error.response?.data || 'Error updating Site'));
        console.log("Error Deleting sites", error.message)
    }
};

// Fetch Managers for a Specific Site
export const fetchSitesByManager = () => async (dispatch) => {
    dispatch(sitePending());
    try {
        const response = await apiClient.get(`/api/v1/sites/manager/sites`);
        console.log("Fetched sites:", response.data.sites); // Debugging log
        dispatch(siteSuccess(response.data.sites || [])); // Ensure array
    } catch (error) {
        dispatch(siteFailure(error.response?.data || "Error fetching Sites"));
        console.log("Error Fetching Manager Sites:", error.message);
    }
};

