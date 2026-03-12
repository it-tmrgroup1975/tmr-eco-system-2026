// frontend/src/hooks/useEmployees.ts
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';

export const useEmployees = (filters: any) => {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getAll(filters),
    // Business Logic: กรองข้อมูลเบื้องต้นหรือจัดฟอร์แมตข้อมูลก่อนส่งให้ UI
    select: (data) => data.map(emp => ({
      ...emp,
      fullName: `${emp.first_name} ${emp.last_name}`
    }))
  });
};