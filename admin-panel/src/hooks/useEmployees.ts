import { useQuery } from '@tanstack/react-query';
import { employeeApi, type PaginatedResponse } from '../api/employeeApi';
import type { Employee } from '../types/employee';

export const useEmployees = (filters: any) => {
  return useQuery<PaginatedResponse<Employee>>({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getAll(filters),
    // Business Logic: แก้ไขโครงสร้างข้อมูลภายใน results พร้อมคง Metadata ของ Pagination ไว้
    select: (data) => ({
      ...data,
      results: data.results.map((emp: Employee) => ({
        ...emp,
        fullName: `${emp.first_name} ${emp.last_name}`.trim() || emp.username
      }))
    })
  });
};