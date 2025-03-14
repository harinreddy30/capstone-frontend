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
    } else {
        console.log('No token found in localStorage');
    }
    return config;
}, (error) => {
    // Handle request error
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        
        if (error.response?.status === 403) {
            console.log('Auth error:', error.response);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
