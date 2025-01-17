import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Function to refresh access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;

        // Store the new access token
        localStorage.setItem('accessToken', access);
        return access;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;
    }
};

// Axios request interceptor to attach the access token
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');

        if (!token) {
            try {
                token = await refreshAccessToken(); // Try refreshing the token
            } catch (error) {
                console.error('Unable to refresh token. Logging out...');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login
                throw error;
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// API Methods
export const login = async (username, password) => {
    const response = await api.post('/login/', { username, password });

    // Store tokens after login
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    return response.data;
};

export const getEvents = async () => {
    const response = await api.get('/events/');
    return response.data;
};

export const createEvent = async (event) => {
    const response = await api.post('/events/', event);
    return response.data;
};

export const getEventSet = async (eventId) => {
    const response = await api.get(`/event-set/${eventId}/`);
    return response.data;
};

export const updateEventSet = async (eventId, data) => {
    const response = await api.put(`/event-set/${eventId}/`, { data });
    return response.data;
};

export default api;
