import type { Payslip, BulkSendRequest, EmailResponse } from "../types/payroll";
import axiosInstance from "./axios";

export const payrollApi = {
  // ดึงข้อมูลรายการ Payslip ทั้งหมด (สำหรับ Admin)
  getAllPayslips: async (): Promise<Payslip[]> => {
    const response = await axiosInstance.get("/api/admin-payslips/");
    return response.data;
  },

  getPayslipDetail: async (id: number): Promise<Payslip> => {
    const response = await axiosInstance.get(`/api/admin-payslips/${id}/`);
    return response.data;
  },

  // ส่งอีเมลแบบกลุ่ม
  sendBulkEmails: async (data: BulkSendRequest): Promise<EmailResponse> => {
    const response = await axiosInstance.post("/api/admin-payslips/bulk-send/", data);
    return response.data;
  },

  // ดึงข้อมูล Payslip ของตัวเอง (สำหรับ Employee Portal)
  getMyPayslips: async (): Promise<Payslip[]> => {
    const response = await axiosInstance.get("/api/my-payslips/");
    return response.data;
  },

  importPayroll: async (formData: FormData): Promise<any> => {
    const response = await axiosInstance.post("/api/admin-payslips/import-excel/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  downloadTemplate: async (): Promise<void> => {
    const response = await axiosInstance.get("/api/admin-payslips/download-template/", {
      responseType: 'blob', // สำคัญมาก: ต้องระบุเป็น blob เพื่อรับไฟล์ binary
    });

    // สร้างลิงก์ชั่วคราวเพื่อดาวน์โหลดไฟล์
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payroll_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};