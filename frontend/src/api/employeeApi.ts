// frontend/src/api/employeeApi.ts
import type { Employee, Department, Position } from "../types/employee";
import api from "./axios";
import axiosInstance from "./axios";

/**
 * Interface สำหรับ Filter ในการดึงข้อมูลพนักงาน
 */
interface EmployeeFilters {
  department?: string | number;
  position?: string | number;
  search?: string;
  [key: string]: any;
}

export const employeeApi = {
  /**
   * ดึงรายชื่อพนักงานทั้งหมด
   * ระบุ Type เป็น Employee[] เพื่อให้ TanStack Query ใช้งานได้ทันที
   */
  getAll: async (params?: { department?: string }) => {
    // axios จะจัดการเปลี่ยน { department: "IT" } เป็น ?department=IT ให้โดยอัตโนมัติ
    const response = await api.get("/api/employees/", { params });
    // ตรวจสอบว่า Backend ของคุณใช้ Pagination หรือไม่ 
    // ถ้าใช้ให้รีเทิร์น response.data.results
    return response.data.results || response.data;
  },

  /**
   * ดึงข้อมูลพนักงานรายบุคคล
   * ปรับ ID ให้รับได้ทั้ง string และ number เพื่อป้องกัน Type Mismatch
   */
  getById: async (id: string | number): Promise<Employee> => {
    const response = await axiosInstance.get<Employee>(`/api/employees/${id}/`);
    return response.data;
  },

  /**
   * สร้างพนักงานใหม่
   * ใช้ FormData สำหรับรองรับการอัปโหลดไฟล์ (avatar)
   */
  create: async (formData: FormData): Promise<Employee> => {
    const response = await axiosInstance.post<Employee>("/api/employees/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * อัปเดตข้อมูลพนักงาน
   * ใช้ PATCH เพื่อความยืดหยุ่นในการอัปเดตเฉพาะบางฟิลด์
   */
  update: async (id: string | number, formData: FormData): Promise<Employee> => {
    // เปลี่ยนจาก .put เป็น .patch ตามมาตรฐาน DRF สำหรับการอัปเดตบางส่วน
    const response = await axiosInstance.patch<Employee>(`/api/employees/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * ลบข้อมูลพนักงาน
   * ปรับ ID ให้รับได้ทั้ง string และ number
   */
  delete: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/api/employees/${id}/`);
  },

  /**
   * ดึงรายชื่อแผนกทั้งหมด
   */
  getDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<Department[]>("/api/departments/");
    return response.data;
  },

  /**
   * ดึงรายชื่อตำแหน่งงานทั้งหมด
   */
  getPositions: async (): Promise<Position[]> => {
    const response = await axiosInstance.get<Position[]>("/api/positions/");
    return response.data;
  },
};