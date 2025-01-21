import axios from "axios";

// Create an Axios Connection
const apiClient = axios.create({
    baseURL: '', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config))



export default apiClient;
