import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// axios.defaults.baseURL = 'https://127.0.0.1:8000';
axios.defaults.baseURL = "http://vps-7cceaa46.vps.ovh.net:8437";

// Function to validate the token
const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
            // Token has expired
            return false;
        }
        return true;
    } catch (error) {
        // Token is invalid
        return false;
    }
};

// Set the Authorization header with the token if valid
const setAuthToken = token => {
    if (isTokenValid(token)) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Retrieve token from localStorage and set it in Axios headers on initial load
const token = localStorage.getItem('token');
if (isTokenValid(token)) {
    setAuthToken(token);
} else {
    localStorage.removeItem('token'); // Remove invalid/expired token
}

export async function loginUser(username, password) {
    try {
        const response = await axios.post('/api/login_check', { username, password });
        localStorage.setItem('token', response.data.token); // Store the token
        setAuthToken(response.data.token);
        return { success: true };
    } catch (error) {
        return { error: error.response?.data || error };
    }
}

export async function registerUser(email, password, name, passwordConfirmation) {
    try {
        const response = await axios.post('/api/register', {
            username: email,  // Assuming the API expects `username` as the email
            password,
            name,
            passwordConfirmation
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { error: error.response?.data || error };
    }
}

export async function logoutUser() {
    localStorage.removeItem('token'); // Remove the token
    setAuthToken(null);
    return { success: true };
}
