// Entry point of the React app
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Base CSS styles
import App from './App'; // Main App component

// Create a root to render the React component tree into the <div id="root"> in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside React.StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);