export interface Payslip {
  id: number;
  employee_name: string;
  period_month: number;
  period_year: number;
  net_salary: number;
  is_email_sent: boolean;
}

export interface BulkSendRequest {
  ids: number[];
}