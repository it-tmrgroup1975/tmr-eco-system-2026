// frontend/src/api/axios.ts
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. ปรับการเช็ค 401 ให้รัดกุมขึ้น (ป้องกัน Infinity Loop)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // ตรวจสอบ URL ให้แน่ใจว่าไม่ซ้อน /api/api
                    const refreshUrl = '/token/refresh/'; // ใช้ Path สั้นถ้า baseURL มี /api แล้ว
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}${refreshUrl}`, {
                        refresh: refreshToken,
                    });

                    const { access } = response.data;
                    localStorage.setItem('access_token', access);

                    // อัปเดต Header และยิง Request เดิม
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // ล้างค่าและเด้งไป Login เฉพาะเมื่อ Refresh ไม่สำเร็จจริงๆ
                    localStorage.clear(); // ล้างทั้งหมดรวมถึง auth-storage ของ Zustand
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        // 2. ปรับการแจ้งเตือน Error 400 ให้เจาะจง
        if (error.response?.status === 400) {
            const detail = error.response.data.detail || "ข้อมูลไม่ถูกต้อง";
            toast.error(detail, { id: "api-error" });
        }

        return Promise.reject(error);
    }
);

export default api;