// frontend/src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token before sending
API.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo && userInfo.token) {
    // Attach the JWT to the Authorization header
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;