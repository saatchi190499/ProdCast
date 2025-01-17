import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    return response.data;
};

export const getEvents = async () => {
    const response = await axios.get(`${API_URL}/events/`);
    return response.data;
};

export const createEvent = async (event) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/events/`, event, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getEventSet = async (eventId) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_URL}/event-set/${eventId}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateEventSet = async (eventId, data) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_URL}/event-set/${eventId}/`, { data }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};