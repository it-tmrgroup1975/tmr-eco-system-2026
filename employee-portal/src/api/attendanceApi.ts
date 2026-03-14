import axiosInstance from './axios';

export const attendanceApi = {
  // ดึงข้อมูลวันนี้
  getTodayStatus: () => axiosInstance.get('/attendance/today/'),
  
  // กด Check-in
  checkIn: (location?: string) => 
    axiosInstance.post('/attendance/check_in/', { location }),

  // กด Check-out
  checkOut: () => axiosInstance.post('/attendance/check_out/'),
    
  // ดึงประวัติ
  getHistory: () => axiosInstance.get('/attendance/history/'),
};