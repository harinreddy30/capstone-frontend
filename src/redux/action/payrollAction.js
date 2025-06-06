import apiClient from '../../api/apiClient';
import {
    payrollPending,
    payrollSuccess,
    payrollFailure,
    payrollGenerateSuccess,
    payrollUpdateSuccess,
    payrollDeleteSuccess,
    setCurrentPayroll,
    setTotalHoursWorked,
    payrollByIdPending,
    payrollByIdSuccess,
    payrollByIdFailure
} from '../slices/payrollSlice';

// Generate new payroll
export const generatePayroll = (payrollData) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        console.log('Attempting to generate payroll with data:', JSON.stringify(payrollData, null, 2));
        
        const response = await apiClient.post('/api/v1/payroll/generate', payrollData);
        console.log('Server response:', response.data);
        
        if (response.data && response.data.success) {
            dispatch(payrollGenerateSuccess(response.data.payroll));
            return {
                success: true,
                payroll: response.data.payroll
            };
        } else {
            const errorMsg = response.data?.message || 'Failed to generate payroll';
            console.error('Server indicated failure:', errorMsg);
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Detailed error information:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Error generating payroll';
        dispatch(payrollFailure(errorMessage));
        throw error;
    }
};

// Fetch all payrolls
export const fetchAllPayrolls = () => async (dispatch) => {
    dispatch(payrollPending());
    try {
        console.log('Making API request...');
        const response = await apiClient.get('/api/v1/payroll');
        console.log('Raw API response:', response);
        
        // Update this part to match the API response structure
        const payrollsData = response.data.payroll || [];
                
        console.log('Processed payrolls data:', payrollsData);
        dispatch(payrollSuccess(payrollsData));
        return payrollsData;
    } catch (error) {
        console.error('API Error:', error.response || error);
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching payrolls'));
    }
};

// Get payroll for specific user
export const fetchUserPayrolls = () => async (dispatch) => {
    dispatch(payrollPending());
    try {
        console.log('Fetching user payrolls...');
        const response = await apiClient.get('/api/v1/payroll/user');
        console.log('User payrolls response:', response);
        
        // Handle the response data structure
        const payrollsData = response.data.payrolls.payrolls || [];
        console.log('Processed user payrolls:', payrollsData);
        
        dispatch(payrollSuccess(payrollsData));
        return payrollsData;
    } catch (error) {
        console.error('Error fetching user payrolls:', error);
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching user payrolls'));
        throw error;
    }
};

// Get single payroll by ID
export const fetchPayrollById = (payrollId) => async (dispatch) => {
    dispatch(payrollByIdPending());
    try {
        const response = await apiClient.get(`/api/v1/payroll/review/${payrollId}`);
        dispatch(payrollByIdSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(payrollByIdFailure(error.response?.data?.message || 'Error fetching payroll'));
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

// Fetch total hours worked by users for a given pay period
export const fetchTotalHoursForPayPeriod = (payPeriodStart, payPeriodEnd) => async (dispatch) => {
    dispatch(payrollPending());
    try {
        // Send payPeriodStart and payPeriodEnd as query parameters in the GET request
        const response = await apiClient.get('/api/v1/payroll/get-payroll', {
            params: {
                payPeriodStart,
                payPeriodEnd
            }
        });

        // If the response is successful, dispatch the data to Redux state
        dispatch(setTotalHoursWorked(response.data));
        return response.data;
    } catch (error) {
        dispatch(payrollFailure(error.response?.data?.message || 'Error fetching total hours'));
        console.error('Error fetching total hours:', error);
    }
};