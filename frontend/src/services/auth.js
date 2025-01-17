import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const refreshAccessToken = async () => {
    try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token available');

        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
        const { access } = response.data;

        localStorage.setItem('accessToken', access);
        return access;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        return null;
    }
};

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};
