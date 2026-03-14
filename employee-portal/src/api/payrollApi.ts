// src/api/payrollApi.ts
import type { Payslip } from "../types/payroll";
import axiosInstance from "./axios";

export const payrollApi = {
  /**
   * แก้ไข Path ให้ตรงกับ Backend: /api/admin-payslips/my-payslips/
   * โดยตัด /api/ ตัวหน้าออกเพราะอยู่ใน axios base URL แล้ว
   */
  getMyPayslips: async (): Promise<Payslip[]> => {
    // ใช้ /admin-payslips/ แทน /payroll/ เพราะใน urls.py ลงทะเบียนชื่อนี้ไว้
    const response = await axiosInstance.get<Payslip[]>("/admin-payslips/my-payslips/");
    return response.data;
  },

  /**
   * เพิ่มฟังก์ชันสำหรับดึงรายละเอียดรายใบ (สำหรับหน้า MyPayslipDetail)
   */
  getPayslipDetail: async (id: number): Promise<Payslip> => {
    // ต้องตรวจสอบว่า axios base URL มี /api หรือยัง 
    // ถ้ามีแล้ว ให้เริ่มด้วย /admin-payslips/
    const response = await axiosInstance.get<Payslip>(`/admin-payslips/${id}/`);
    return response.data;
  }
};