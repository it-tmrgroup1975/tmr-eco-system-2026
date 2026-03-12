// frontend/src/types/employee.ts
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export interface Employee {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    username: string;
    department: string;
    position: string;
    employment_type: string;
    email?: string;
    phone?: string;
    avatar?: string;
}