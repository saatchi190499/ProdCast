import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root for React 18
const root = createRoot(rootElement);

// Render the app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
