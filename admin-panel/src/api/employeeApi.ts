import type { Employee, Department, Position } from "../types/employee";
import axiosInstance from "./axios";

export interface EmployeeFilters {
  page?: number;        // เพิ่มรองรับเลขหน้า
  page_size?: number;   // เพิ่มรองรับขนาดหน้า
  department?: string | number;
  position?: string | number;
  search?: string;
  employment_type?: string;
  [key: string]: any;
}

/** 1. Interface ใหม่สำหรับรองรับโครงสร้างแบบ Pagination */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const employeeApi = {
  /** * 2. ปรับปรุง getAll:
   * - เปลี่ยน Return Type เป็น Promise<PaginatedResponse<Employee>>
   * - รองรับพารามิเตอร์การแบ่งหน้า (page, page_size)
   */
  getAll: async (params?: EmployeeFilters): Promise<PaginatedResponse<Employee>> => {
    const response = await axiosInstance.get<PaginatedResponse<Employee>>("/api/employees/", { 
      params: {
        page: params?.page || 1,
        page_size: params?.page_size || 12,
        ...params
      } 
    });
    return response.data;
  },

  /** ดึงข้อมูลพนักงานรายบุคคล */
  getById: async (id: string | number): Promise<Employee> => {
    const response = await axiosInstance.get<Employee>(`/api/employees/${id}/`);
    return response.data;
  },

  /** สร้างพนักงานใหม่ */
  create: async (formData: FormData): Promise<Employee> => {
    const response = await axiosInstance.post<Employee>("/api/employees/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** อัปเดตข้อมูลพนักงาน (PATCH) */
  update: async (id: string | number, formData: FormData): Promise<Employee> => {
    const response = await axiosInstance.patch<Employee>(`/api/employees/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** ลบข้อมูลพนักงาน */
  delete: async (id: string | number): Promise<void> => {
    await axiosInstance.delete(`/api/employees/${id}/`);
  },

  /** ข้อมูลสนับสนุนสำหรับ Dropdown */
  getDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<Department[]>("/api/departments/");
    return response.data;
  },

  getPositions: async (): Promise<Position[]> => {
    const response = await axiosInstance.get<Position[]>("/api/positions/");
    return response.data;
  },
};

/** ฟังก์ชันสำหรับการ Export ข้อมูลพนักงาน */
export const exportEmployees = async () => {
  const response = await axiosInstance.get("/api/employees/export-excel/", {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `TMR_Employees_${new Date().getTime()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/** ฟังก์ชันสำหรับการ Import ข้อมูลพนักงาน */
export const importEmployees = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post("/api/employees/import-excel/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const downloadImportTemplate = async () => {
  const response = await axiosInstance.get("/api/employees/download-template/", {
    responseType: 'blob', // สำคัญ: ต้องระบุเป็น blob เพื่อรับไฟล์
  });
  
  // สร้าง Link ลับในหน่วยความจำและสั่งคลิกเพื่อดาวน์โหลด
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'employee_import_template.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url); // ล้างหน่วยความจำ
};