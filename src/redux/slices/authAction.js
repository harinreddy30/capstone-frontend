import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import axios from 'axios';

export const loginUser = ({ email, password }) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await axios.post('/api/v1/login', {email, password});
        dispatch(loginSuccess(response.data));
        return response.data; // Return data to handle role-based redirection

    } catch (error) {
        dispatch(loginFailure(error.response.data.message || 'Login Failed'));
        return null
    }

}