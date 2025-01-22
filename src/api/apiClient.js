import axios from "axios";

const BACKEND_URI = process.env.REACT_APP_BACKEND_URI

// Create an Axios Connection
const apiClient = axios.create({
    baseURL: BACKEND_URI, // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});

export default apiClient;
