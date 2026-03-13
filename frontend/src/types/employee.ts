// frontend/src/types/employee.ts
export type EmploymentType = 'full_time' | 'part_time' | 'contract';

export interface EmployeeFormInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  employment_type: string;
  department: string;
  position: string;
}


export interface Employee {
  id: number;
  employee_id: string | null;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: 'admin' | 'supervisor' | 'staff';
  department_name: string | null; 
  position_name: string | null;
  department: string | null; 
  position: string | null;
  employment_type: 'full_time' | 'contract' | 'part_time';
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