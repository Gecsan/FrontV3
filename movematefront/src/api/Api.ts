import axios from "axios";

export const base_URL = "http://127.0.0.1:8000/";
const AxiosInstance = axios.create({
  baseURL: base_URL,
});

// request interceptor to ad access token to every request
AxiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access");
    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    console.log("Request config :: ", config);
    return config;
  },
  (error) => {
    console.error("Request error :: ", error);
    return Promise.reject(error);
  }
);

// handle 401 and 403 response status
AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      try {
        // Attempt to get a new access token using the refresh token
        const refreshToken = {
          refresh: localStorage.getItem("refresh"), // set the current refresh token as payload
        };
        const refreshUrl = `${base_URL}api/login/refresh`;

        const response = await axios.post(refreshUrl, refreshToken);
        if (response.status === 200) {
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          // Update access token in local storage
          localStorage.setItem("access", newAccessToken);
          localStorage.setItem("refresh", newRefreshToken);

          // Retry the initial request with the new access token
          const initialRequest = error.config;
          initialRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return AxiosInstance(initialRequest); // Return the new request promise
        } else {
          // If refresh fails, redirect to login
          // router.push({ name: 'login' });

          window.location.href = "/login";

          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // router.push({ name: "login" });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
