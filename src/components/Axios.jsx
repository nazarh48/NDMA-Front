import axios from "axios";
import appConfig from "../config/appConfig";
const axiosInstance = axios.create({
  baseURL: appConfig.apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("NCOP-Auth-Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem("NCOP-Auth-Token");
//       window.location.href = "/login";
//     } else {
//       alert("An error occurred. Please try again.");
//     }
//     return Promise.reject(error);
//   },
// );

const _axios = async (method, url, data) => {
  try {
    const response = await axiosInstance({
      method: method,
      url: url,
      data: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default _axios;
