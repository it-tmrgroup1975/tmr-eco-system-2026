import api from "./axios";

export interface Employee {
  id: number;
  employee_id: string;
  username: string;     // เพิ่มฟิลด์นี้เพื่อให้ตรงตามที่ LoginPage/AppLayout ต้องการ
  first_name: string;
  last_name: string;
  department_name: string;
  position_name: string;
  role: string;
  employment_type: string;
  avatar?: string;      // เพิ่มฟิลด์รูปโปรไฟล์ (Optional) เพื่อแก้ปัญหา Property 'avatar' does not exist
  email?: string;       // เพิ่มเพื่อให้ Kanban Card แสดงผลได้สมบูรณ์
  phone?: string;       // เพิ่มเพื่อให้ Kanban Card แสดงผลได้สมบูรณ์
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get("/api/employees/");
  return response.data;
};

export const createEmployee = async (formData: FormData): Promise<Employee> => {
  const response = await api.post("/api/employees/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};