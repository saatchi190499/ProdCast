import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken'); // Проверка токена
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
