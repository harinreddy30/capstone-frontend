import axios from 'axios';
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from '../slices/profileSlice';
import { updateUser } from '../slices/authSlice';

// Use the environment variable for the backend URL
const BASE_URL = process.env.REACT_APP_API_URL;

export const updateProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch(updateProfileStart());
    
    const { token } = getState().auth;
    console.log('Current token:', token); // Debug log

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };

    // Format the data for the backend
    const formattedData = {
      fname: profileData.firstName,
      lname: profileData.lastName,
      email: profileData.email,
      phone: profileData.mobileNumber,
      homePhone: profileData.homeNumber,
      dateOfBirth: profileData.birthDate,
      pronouns: profileData.pronouns,
      language: profileData.language,
      profile: profileData.profilePhoto
    };

    console.log('Sending data to backend:', formattedData); // Debug log
    console.log('API URL:', `${BASE_URL}/api/users/profile/update`); // Debug log

    const response = await axios.put(
      `${BASE_URL}/api/users/profile/update`,
      formattedData,
      config
    );

    console.log('Response from backend:', response.data); // Debug log

    // Update both profile and auth states
    dispatch(updateProfileSuccess(response.data));
    dispatch(updateUser(response.data));

    return response.data;
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response?.data); // Debug log
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    dispatch(updateProfileFailure(errorMessage));
    throw error;
  }
};

// Add a function to fetch profile data
export const fetchProfile = () => async (dispatch, getState) => {
  try {
    dispatch(updateProfileStart());
    
    const { token } = getState().auth;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    };

    console.log('Fetching profile...'); // Debug log
    const response = await axios.get(
      `${BASE_URL}/api/users/profile`,
      config
    );

    console.log('Fetched profile data:', response.data); // Debug log

    dispatch(updateProfileSuccess(response.data));
    dispatch(updateUser(response.data));
    return response.data;
  } catch (error) {
    console.error('Fetch profile error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
    dispatch(updateProfileFailure(errorMessage));
    throw error;
  }
}; 