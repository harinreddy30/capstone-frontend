import { loginStart, loginSuccess, loginFailure, forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure } from '../slices/authSlice';
import apiClient from '../../api/apiClient';
import { toast } from "react-toastify";


// AuthAction handle asynchoronous login logic and make the API call to the backend

export const loginUser = ({ email, password }) => async (dispatch) => {
    dispatch(loginStart());
        
    // Validate input fields
    if (!email || !password) {
        dispatch(loginFailure('Email and password are required.'));
        return null;
    }

    try {
        const response = await apiClient.post('/api/v1/login', {email, password});

        if (response?.data) {
            const token = response.data.token
            const user = response.data.user
            
            // Set token in apiClient defaults after login
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            dispatch(loginSuccess({ user, token })); // Update Redux state

            // Save token to localStorage for persistence across reloads
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user)); // Store user as JSON string

            return response.data; // Return data to handle role-based redirection
        } else {
            throw new Error('Response data is undefined');
        }

    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        const errorMessage = error.response?.data?.message || 'Login Failed'; // Extract error message
        dispatch(loginFailure(errorMessage)); // Update Redux state
        return null; // Return null to indicate failure
    }
}

// ForgotPassword action handles the API call to send the reset link to the user's email
export const forgotPassword = ({ email }) => async (dispatch) => {
    dispatch(forgotPasswordStart());

    // Validate email input
    if (!email) {
        dispatch(forgotPasswordFailure('Email is required.'));
        return null;
    }

    try {
        const response = await apiClient.post('/api/v1/users/forgot-password', { email });

        if (response?.data) {
            // Dispatch success action if reset link is sent successfully
            dispatch(forgotPasswordSuccess(response.data.message));
            return response.data;
        } else {
            throw new Error('Response data is undefined');
        }
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        const errorMessage = error.response?.data?.message || 'An error occurred while sending the reset link';
        dispatch(forgotPasswordFailure(errorMessage)); // Update Redux state with error
        return null;
    }
};

export const resetPassword = (token, password) => async (dispatch) => {
    try {
        const response = await apiClient.post(`/api/v1/users/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Something went wrong';
    }
};

export const setToken = (token) => ({
    type: 'SET_TOKEN',
    payload: token,
});