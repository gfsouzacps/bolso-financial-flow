import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5114', // Assumindo que o backend roda nesta porta
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
