// frontend/src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ดักจับ Request เพื่อใส่ Token ไปใน Header ทุกครั้งอัตโนมัติ
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

        // ถ้า Error เป็น 401 (Unauthorized) และยังไม่ได้ลองขอ token ใหม่
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // ไปที่ endpoint ของ SimpleJWT เพื่อขอ access token ใหม่
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    
                    // ใส่ token ใหม่และยิง request เดิมซ้ำอีกครั้ง
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // ถ้า refresh token ก็หมดอายุด้วย ให้เตะไปหน้า login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;