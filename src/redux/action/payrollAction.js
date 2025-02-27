import apiClient from '../../api/apiClient';
import {
    payrollPending,
    payrollSuccess,
    payrollFailure,
    payrollGenerateSuccess,
    payrollUpdateSuccess,
    payrollDeleteSuccess,
    setCurrentPayroll
} from '../slices/payrollSlice';

// Generate new payroll
export const generatePayroll = (payrollData) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.post('/api/v1/payroll/generate', payrollData);
        dispatch(payrollGenerateSuccess(response.data.payroll));
        return response.data;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error generating payroll'));
        console.error('Error generating payroll:', error);
        throw error;
    }
};

// Fetch all payrolls
export const fetchAllPayrolls = () => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.get('/api/v1/payroll');
        // Ensure we're dispatching an array
        const payrollsData = Array.isArray(response.data) ? response.data : [];
        dispatch(payrollSuccess(payrollsData));
        return payrollsData;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching payrolls'));
        console.error('Error fetching payrolls:', error);
    }
};

// Get payroll for specific user
export const fetchUserPayrolls = () => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.get('/api/v1/payroll/user');
        const payrollsData = Array.isArray(response.data) ? response.data : [];
        dispatch(payrollSuccess(payrollsData));
        return payrollsData;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching user payrolls'));
        console.error('Error fetching user payrolls:', error);
    }
};

// Get single payroll by ID
export const fetchPayrollById = (payrollId) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.get(`/api/v1/payroll/review/${payrollId}`);
        dispatch(setCurrentPayroll(response.data));
        return response.data;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching payroll'));
        console.error('Error fetching payroll:', error);
    }
};

// Update payroll
export const updatePayroll = (payrollId, payrollData) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.put(`/api/v1/payroll/${payrollId}`, payrollData);
        dispatch(payrollUpdateSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error updating payroll'));
        console.error('Error updating payroll:', error);
    }
};

// Delete payroll
export const deletePayroll = (payrollId) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        await apiClient.delete(`/api/v1/payroll/${payrollId}`);
        dispatch(payrollDeleteSuccess(payrollId));
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error deleting payroll'));
        console.error('Error deleting payroll:', error);
    }
};

// Finalize payroll
export const finalizePayroll = (payrollId, userId) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        const response = await apiClient.put(`/api/v1/payroll/review/${payrollId}`, { userId });
        dispatch(payrollUpdateSuccess(response.data.payroll));
        return response.data;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error finalizing payroll'));
        console.error('Error finalizing payroll:', error);
    }
}; 