import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwtDecode(token); // Decode the token
        return decodedToken.userId || decodedToken.id; // Adjust based on your token structure
    }
    return null; // Return null if no token or userId is found
};


