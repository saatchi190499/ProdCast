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
    try {
        const response = await axios.post(`${API_URL}/login/`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Rethrow the error to handle it in the component
    }
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
    console.log("Event ID:", eventId);

    return response.data;
};

export const deleteEvent = async (eventId) => {
    const response = await api.delete(`/event-delete/${eventId}/`);
    console.log("Delete Event ID:", eventId);

    return response.data;
};

export const updateEventSet = async (eventId, data) => {
    try {
        const response = await api.put(`/event-set/${eventId}/`, data); // Send data directly
        return response.data;
    } catch (error) {
        console.error('Failed to update event set:', error.response?.data || error.message);
        throw error;
    }
};

// Fetch object instances
export const getObjectInstances = async () => {
    const response = await axios.get(`${API_URL}/object-instances/`);
    return response.data;
};

// Fetch object type properties
export const getObjectTypeProperties = async () => {
    const response = await axios.get(`${API_URL}/object-type-properties/`);
    return response.data;
};

// Fetch sub data sources
export const getSubDataSources = async () => {
    const response = await axios.get(`${API_URL}/sub-data-sources/`);
    return response.data;
};
// Fetch sub data sources
export const getObjectTypes = async () => {
    const response = await axios.get(`${API_URL}/object-types/`);
    return response.data;
};

// Fetch all dropdown data
export const getDropdownData = async () => {
    const [objectTypes,objectInstances, objectTypeProperties, subDataSources] = await Promise.all([
        getObjectTypes(),
        getObjectInstances(),
        getObjectTypeProperties(),
    ]);
    return { objectTypes, objectInstances, objectTypeProperties };
}

export default api;
