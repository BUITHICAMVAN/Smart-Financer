import axios from "axios";
import { jwtDecode } from "jwt-decode"
import { history } from "../"

export const TOKEN = 'token';
export const DOMAIN_BACKEND = 'http://localhost:5000/api/v1/';

// Create an Axios instance
export const http = axios.create({
    baseURL: DOMAIN_BACKEND,
    timeout: 30000,
});

// Configure request interceptor
http.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Configure response interceptor
http.interceptors.response.use((response) => {
    return response;
}, error => {
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 400) {
        history.push('/');
    } else if (statusCode === 401) {
        const token = localStorage.getItem(TOKEN);
        if (token) {
            const decodedToken = jwtDecode(token);
            const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
            if (Date.now() >= expirationTime) {
                // Call API to refresh token
                console.log('Token expired, calling refresh token API...');
                // Implement refresh token logic here
            }
        }
        history.push('/signin-page');
    } else if (statusCode === 403) {
        alert('You do not have permission to access this page');
        history.push('/');
    }
    return Promise.reject(error);
});
