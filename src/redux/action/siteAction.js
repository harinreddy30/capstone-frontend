import apiClient from '../../api/apiClient';
import {
    sitePending,
    siteSuccess,
    siteFailure,
    siteByIdSuccess,
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
        console.log("Sites response:", response.data);
        const sitesData = response.data.Sites || response.data.sites || response.data || [];
        
        const normalizedSites = sitesData.map(site => ({
            ...site,
            status: site.status || 'active'
        }));
        
        console.log("Normalized sites data:", normalizedSites);
        dispatch(siteSuccess(normalizedSites));
    } catch (error) {
        console.error("Error Fetching sites:", error.response || error);
        dispatch(siteFailure(error.response?.data || 'Error fetching Sites')); 
    }
}

// Fetch a Site by ID (HR, SuperAdmin)
export const fetchSiteById = (siteId) => async(dispatch) => {
    dispatch(sitePending());
    try {
        const response = await apiClient.get(`/api/v1/sites/site/${siteId}`)
        console.log("Received Site Data", response.data)
        dispatch(siteByIdSuccess(response.data)); // Dispatch success with the user data
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

// Update a site
export const updateSite = (siteId, updatedData) => async (dispatch) => {
    dispatch(sitePending());
    try {
        // Ensure status is included in the update
        const dataToUpdate = {
            ...updatedData,
            status: updatedData.status || 'active',
            updatedAt: new Date()
        };

        // If status is being changed to archived, add archive date and reason
        if (dataToUpdate.status === 'archived') {
            dataToUpdate.archiveDate = new Date();
        }

        // If status is being changed to active, clear archive fields
        if (dataToUpdate.status === 'active') {
            dataToUpdate.archiveDate = null;
            dataToUpdate.archiveReason = null;
            dataToUpdate.lastActiveDate = new Date();
        }

        // If status is being changed to inactive, update lastActiveDate
        if (dataToUpdate.status === 'inactive') {
            dataToUpdate.lastActiveDate = new Date();
        }

        console.log('Updating site with data:', dataToUpdate);
        const response = await apiClient.put(`/api/v1/sites/${siteId}`, dataToUpdate);
        console.log('Update response:', response.data);
        
        // Update the site in Redux store
        dispatch(siteUpdateSuccess(response.data));
        
        // Fetch all sites to ensure the list is up to date
        await dispatch(fetchAllSites());
        
        return response.data;
    } catch (error) {
        console.error("Error updating site:", error.response || error);
        dispatch(siteFailure(error.response?.data || 'Error updating site'));
        throw error;
    }
};

// Delete a User
export const DeleteSite = (siteId) => async (dispatch) => {
    dispatch(sitePending());
    try {
        await apiClient.delete(`/api/v1/sites/${siteId}`);
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
        console.log("Fetched sites:", response.data); // Debugging log
        dispatch(siteSuccess(response.data.Sites || [])); // Ensure array
    } catch (error) {
        dispatch(siteFailure(error.response?.data || "Error fetching Sites"));
        console.log("Error Fetching Manager Sites:", error.message);
    }
};

