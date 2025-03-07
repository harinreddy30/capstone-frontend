import axios from "axios";

const BACKEND_URI = process.env.REACT_APP_BACKEND_URI

// Create an Axios Connection
const apiClient = axios.create({
    baseURL: BACKEND_URI, // Backend URL
    // Add default headers
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        // Ensure token format is consistent
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request error
    return Promise.reject(error);
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            console.log('Auth error:', error.response);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
