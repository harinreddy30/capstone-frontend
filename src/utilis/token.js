import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token); // Decode the token
        return decodedToken.userId || decodedToken.id; // Adjust based on your token structure
    }
    return null; // Return null if no token or userId is found
};

export const getRoleFromToken = () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
        console.error('No token found!');
        return null; // Token not found
    }

    try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);

        // Now you can access the role from the decoded token
        const userRole = decodedToken.role;

        return userRole; // Return the role
    } catch (error) {
        console.error('Invalid token:', error);
        return null; // Return null if token decoding fails
    }
};

