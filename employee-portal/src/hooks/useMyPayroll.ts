// src/hooks/useMyPayroll.ts
import { useQuery } from "@tanstack/react-query";
import { payrollApi } from "../api/payrollApi";

export const useMyPayroll = () => {
  return useQuery({
    queryKey: ["my-payslips"],
    queryFn: payrollApi.getMyPayslips,
    staleTime: 1000 * 60 * 5, // เก็บข้อมูลไว้ 5 นาที
  });
};