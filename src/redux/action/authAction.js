import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import apiClient from '../../api/apiClient';

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

export const setToken = (token) => ({
    type: 'SET_TOKEN',
    payload: token,
});