// frontend/src/types/employee.ts
export type EmploymentType = 'full_time' | 'part_time' | 'contract';
export type UserRole = 'admin' | 'manager' | 'employee' | 'hr';

export interface Employee {
  id: number;
  employee_id: string | null;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: UserRole;
  department_name: string | null; 
  position_name: string | null;
  department: string | null; 
  position: string | null;
  employment_type: EmploymentType;
  phone_number: string | null; 
  avatar?: string | null; 
  avatar_url?: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface Position {
    id: number;
    name: string;
    department: number;
}

// สำหรับใช้ใน Form (มักจะ omit id ออกถ้าเป็นการสร้างใหม่)
export type EmployeeFormInput = Omit<Employee, 'id' | 'full_name'>;