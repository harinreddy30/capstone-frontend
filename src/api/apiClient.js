import axios from "axios";

// Create an Axios Connection
const apiClient = axios.create({
    baseURL: 'https://capstone-backend-shiftsmart.vercel.app/', // Backend URL
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
});

export default apiClient;
