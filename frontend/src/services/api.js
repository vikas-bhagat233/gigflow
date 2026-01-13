import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://gigflow-backend.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true
});

export default api;
