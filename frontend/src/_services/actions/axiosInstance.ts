import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Import here to avoid circular dependency
    import('./auth-actions/actions').then(({ getToken }) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    })
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // Try to refresh token
      try {
        const { refreshToken } = await import('./auth-actions/actions')
        await refreshToken()
        // Retry original request
        return axiosInstance(error.config)
      } catch (refreshError) {
        // Refresh failed, logout user
        const { store } = await import('@/store')
        const { clearAuth } = await import('@/store/slices/userSlice')
        store.dispatch(clearAuth())
        if (typeof window !== 'undefined') {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
