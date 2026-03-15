// frontend/src/types/payroll.ts

export type PaymentCycle = '1H' | '2H';

export interface PayrollPeriod {
  id: string;
  month: number;
  year: number;
  cycle: PaymentCycle;
  cycle_display: string;
  is_closed: boolean;
}

export interface Payslip {
  id: number;
  employee_id: string;
  employee_name: string;
  cycle: PaymentCycle; // เพิ่มฟิลด์นี้
  period_month: number;
  period_year: number;
  salary_amount: string; // Decimal จาก Django จะมาเป็น string ใน JSON
  tax_deduction: string;
  social_security: string;
  net_salary: number; // จาก @property ใน Model
  is_email_sent: boolean;
}

/**
 * Interface สำหรับผลลัพธ์การส่งอีเมล
 * ใช้รองรับทั้งการส่งแบบเดี่ยว (Individual) และแบบกลุ่ม (Bulk)
 */
export interface EmailResponse {
  success: boolean;       // สถานะรวมของ Request
  message: string;       // ข้อความแจ้งเตือนจาก Server (เช่น "ส่งอีเมลสำเร็จ 5 รายการ")
  sent_count: number;    // จำนวนอีเมลที่ส่งออกสำเร็จจริง
  failed_count?: number; // (Optional) จำนวนที่ส่งล้มเหลว
  timestamp: string;     // เวลาที่ดำเนินการเสร็จสิ้น
  
  // ในกรณีที่มีข้อผิดพลาดรายบุคคล (ถ้าต้องการเก็บ Log ละเอียด)
  errors?: Array<{
    employee_id: number;
    error_message: string;
  }>;
}

/**
 * Interface สำหรับ Body ของ Request ที่จะส่งไป Backend
 */
export interface BulkSendRequest {
  ids: number[]; // รายการ ID ของ Payslips ที่ต้องการให้ระบบส่งอีเมล
}