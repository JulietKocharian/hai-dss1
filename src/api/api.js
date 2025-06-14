import axios from "axios";
import jwt_decode from "jwt-decode";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  withCredentials: true,
});

const noAuthEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/forgotPassword",
  "/auth/verifyContact",
  "/auth/newPassword",
];

const refreshAccessToken = async (refreshToken) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/refresh`,
    { refreshToken },
    { withCredentials: true }
  );
  return res.data;
};

// Request Interceptor
const onRequest = async (config) => {
  if (noAuthEndpoints.some((endpoint) => config.url?.endsWith(endpoint))) {
    return config;
  }

  const token = localStorage.getItem("authToken");

  if (!token) return config;

  try {
    const decoded = jwt_decode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (!isExpired) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }

    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return config;
    }

    const data = await refreshAccessToken(refresh);

    localStorage.setItem("authToken", data.access);
    config.headers["Authorization"] = `Bearer ${data.access}`;
    return config;
  } catch (err) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    return config;
  }
};

const onRequestError = (error) => Promise.reject(error);

// Response Interceptor
const onResponseError = async (error) => {
  const originalRequest = error.config;

  if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;

    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(error);
    }

    try {
      const data = await refreshAccessToken(refresh);

      localStorage.setItem("authToken", data.access);
      originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

      return instance(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use((res) => res, onResponseError);
