import axios from "axios";

const api = axios.create({
  baseURL: "https://trackjob-backend.onrender.com/api", // replace with render hosted backend for production
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
