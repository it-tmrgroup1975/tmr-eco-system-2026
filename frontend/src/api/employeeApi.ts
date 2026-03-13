// frontend/src/api/employeeApi.ts
import type { Employee } from "../types/employee";
import axiosInstance from "./axios";

export const employeeApi = {
  /**
   * ดึงรายชื่อพนักงานทั้งหมด
   * Backend path: GET /api/employees/
   */
  getAll: async (filters?: any) => {
    // แก้ไขจาก /api/users/ เป็น /api/employees/ ตาม router.register ใน core/urls.py
    const response = await axiosInstance.get<Employee[]>("/api/employees/", {
      params: filters
    });
    return response.data;
  },

  /**
   * ดึงข้อมูลพนักงานรายบุคคล
   * Backend path: GET /api/employees/{id}/
   */
  getById: async (id: string) => {
    const response = await axiosInstance.get<Employee>(`/api/employees/${id}/`);
    return response.data;
  },

  /**
   * สร้างพนักงานใหม่
   * Backend path: POST /api/employees/
   */
  create: async (formData: FormData) => {
    const response = await axiosInstance.post<Employee>("/api/employees/", formData, {
      headers: {
        // สำคัญ: ต้องระบุ Content-Type เป็น multipart/form-data สำหรับการส่งไฟล์
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * อัปเดตข้อมูลพนักงาน
   * Backend path: PATCH /api/employees/{id}/
   */
  update: async (id: number, formData: FormData) => {
    const response = await axiosInstance.put<Employee>(`/api/employees/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * ลบข้อมูลพนักงาน
   * Backend path: DELETE /api/employees/{id}/
   */
  delete: async (id: string) => {
    await axiosInstance.delete(`/api/employees/${id}/`);
  },

  /**
   * ดึงรายชื่อแผนกทั้งหมดจาก Backend
   * Path: GET /api/departments/
   */
  getDepartments: async () => {
    const response = await axiosInstance.get("/api/departments/");
    return response.data; // ข้อมูลที่ได้จะเป็น Array ของวัตถุแผนก
  },

  /**
   * ดึงรายชื่อแผนกทั้งหมดจาก Backend
   * Path: GET /api/departments/
   */
  getPositions: async () => {
    const response = await axiosInstance.get("/api/positions/");
    return response.data; // ข้อมูลที่ได้จะเป็น Array ของวัตถุแผนก
  },
};