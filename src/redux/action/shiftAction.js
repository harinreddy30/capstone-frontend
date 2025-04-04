import apiClient from '../../api/apiClient';
import {
    fetchShiftsStart,
    fetchShiftsSuccess,
    fetchShiftsFailure,
    addShiftSuccess,
    updateShiftSuccess,
    deleteShiftSuccess,
    shiftByIdSuccess,
    shiftFailure,
    clearShifts
} from '../slices/shiftSlice';

// Fetch shifts for a site
export const fetchShifts = (siteId) => async (dispatch) => {
    try {
        dispatch(fetchShiftsStart());
        const response = await apiClient.get(`/api/v1/shifts/${siteId}`);
        console.log(response.data)
        dispatch(fetchShiftsSuccess(response.data || []));

    } catch (error) {
        dispatch(fetchShiftsFailure(error.response?.data || "Error fetching shifts"));
        console.log("Error Fetching Shifts", error.message);
    }
}

// Fetch a shift by ID
export const fetchShiftById = (shiftId) => async (dispatch) => {
    try {
        dispatch(fetchShiftsStart());
        const response = await apiClient.get(`/api/v1/shifts/shift/${shiftId}`);
        console.log(response.data);
        dispatch(shiftByIdSuccess(response.data || {}));

    } catch (error) {
        dispatch(shiftFailure(error.response?.data || "Error fetching shift"));
        console.log("Error Fetching Shift", error.message);
    }
};

// Add a new shift
export const createShift = (shiftData) => async (dispatch) => {
    try {
        const response = await apiClient.post('/api/v1/shifts', shiftData);
        dispatch(addShiftSuccess(response.data));
    } catch (error) {
        dispatch(fetchShiftsFailure(error.message));
        console.error('Error adding shift:', error);
    }
};


// Update an existing shift
export const updateShift = (shiftId, updatedData) => async (dispatch) => {
    try {
        const response = await apiClient.put(`/api/v1/shifts/${shiftId}`, updatedData);
        dispatch(updateShiftSuccess(response.data));

    } catch (error) {
        dispatch(fetchShiftsFailure(error.message));
        console.error('Error updating shift:', error);
    }
};

// Delete a shift
export const deleteShift = (shiftId) => async (dispatch) => {
    try {
        await apiClient.delete(`/api/v1/shifts/${shiftId}`);
        dispatch(deleteShiftSuccess(shiftId));
    } catch (error) {
        dispatch(fetchShiftsFailure(error.message));
        console.error('Error deleting shift:', error);
    }
};

export const clearShiftsAction = () => (dispatch) => {
    dispatch(clearShifts());
};