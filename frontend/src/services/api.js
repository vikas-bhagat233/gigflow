import axios from "axios";

const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://gigflow-backend-y9z8.onrender.com/api";

// Remove trailing slashes to avoid `//` in requests
const baseURL = String(rawBaseURL).replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000
});

// Surface backend errors in a consistent way
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      "Request failed";

    const enhanced = new Error(message);
    enhanced.status = status;
    enhanced.data = data;
    enhanced.url = error?.config?.url;
    throw enhanced;
  }
);

export default api;