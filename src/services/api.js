import axios from "axios";
import store from "../app/store";
import { login, logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = store.getState().auth;
        const res = await api.post(
          "/auth/refresh-token",
          { refreshToken }
        );
        const { access_token } = res.data;
        store.dispatch(
          login({
            user: store.getState().auth.user, // keep existing user
            access_token,
            refresh_token: refreshToken,
          })
        );
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
