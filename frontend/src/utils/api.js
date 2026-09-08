// import axios from "axios";

// // initialize axios 
// const api = axios.create({
//     baseURL: `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV_URL : process.env.NEXT_PUBLIC_API_BASE_URL}`,
//     // headers: {
//     //     common: { 'Authorization': `Bearer ${localStorage.getItem("authToken")}` }
//     // },
//     withCredentials: true,
    
// });

// export default api;

import axios from "axios";
import { getCookie } from "cookies-next";

// initialize axios
const api = axios.create({
    baseURL: `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV_URL : process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true,
});

// Interceptor to automatically attach the token to every request
api.interceptors.request.use(
    (config) => {
        // Grab the token from cookies (which your authSlice sets on login)
        const token = getCookie("authToken");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;