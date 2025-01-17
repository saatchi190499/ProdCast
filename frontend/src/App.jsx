import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventList from './pages/Inputs/Events/EventList';
import EventSet from './pages/Inputs/Events/EventSet';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <PrivateRoute>
                            <EventList />
                        </PrivateRoute>
                    }
                />
                <Route path="/event-set/:eventId" element={<PrivateRoute><EventSet /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;