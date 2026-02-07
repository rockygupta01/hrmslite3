import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8000', // Adjust if backend runs on a different port
    baseURL: 'https://hrmslite3.onrender.com', // Production (Render)
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
