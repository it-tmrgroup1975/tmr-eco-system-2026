import { Mail, Phone, MapPin, Briefcase, User } from "lucide-react";
import type { Employee } from "../../../types/employee";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";

interface EmployeeKanbanCardProps {
  employee: Employee;
  onClick?: (employee: Employee) => void;
}

export const EmployeeKanbanCard = ({ employee, onClick }: EmployeeKanbanCardProps) => {
  // Mapping สีสำหรับสถานะการจ้างงาน
  const getEmploymentTypeStyles = (type: string) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "full_time":
      case "full-time":
        return "bg-[#4A7C59]/10 text-[#4A7C59] border-[#4A7C59]/20";
      case "contract":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const employmentLabel = {
    full_time: "พนักงานประจำ",
    contract: "สัญญาจ้าง",
    part_time: "ชั่วคราว",
  }[employee.employment_type?.toLowerCase()] || employee.employment_type;

  return (
    <Card
      onClick={() => onClick?.(employee)}
      className={cn(
        "group cursor-pointer transition-all duration-500 relative overflow-hidden",
        "bg-white/70 backdrop-blur-md border-white/40",
        "shadow-soft-double hover:shadow-2xl hover:-translate-y-2",
        "rounded-[2rem] border"
      )}
    >
      {/* ส่วนตกแต่ง Background (Glassmorphism Effect) */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#4A7C59]/5 rounded-full blur-2xl group-hover:bg-[#4A7C59]/10 transition-colors duration-500" />

      <CardContent className="p-6 relative z-10">
        <div className="flex gap-5 items-start">
          {/* 1. ส่วนรูปภาพขนาดใหญ่ (Avatar Section) */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] border-4 border-white overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-500">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={`${employee.first_name} ${employee.last_name}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#4A7C59]/10 text-[#4A7C59] font-black text-2xl uppercase">
                  {employee.first_name?.[0]}
                </div>
              )}
            </div>
            {/* สถานะ Online (Indicator) */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
          </div>

          {/* 2. ข้อมูลพนักงาน (Info Section) */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex flex-col gap-1">
              <h3 className="font-thai font-black text-xl text-[#2D3748] leading-tight truncate group-hover:text-[#4A7C59] transition-colors">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="text-[#4A7C59] text-xs font-bold italic tracking-wide">
                {employee.position_name || "ไม่มีระบุตำแหน่ง"}
              </p>
            </div>

            {/* Badge ประเภทการจ้างงาน */}
            <div className="mt-3">
              <Badge 
                variant="outline" 
                className={cn(
                  "font-thai font-bold text-[10px] px-3 py-0.5 rounded-full border shadow-sm",
                  getEmploymentTypeStyles(employee.employment_type)
                )}
              >
                {employmentLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* 3. รายละเอียดการติดต่อ (Contact Details) */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center gap-3 text-[#2D3748]/50 group-hover:text-[#2D3748]/80 transition-colors duration-300">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <Mail size={14} className="shrink-0" />
            </div>
            <span className="text-xs font-medium truncate">{employee.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-[#2D3748]/50 group-hover:text-[#2D3748]/80 transition-colors duration-300">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <MapPin size={14} className="shrink-0" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tighter">
              {employee.department_name || "ทั่วไป / สำนักงานใหญ่"}
            </span>
          </div>
        </div>

        {/* 4. ขอบล่าง Action Decorator */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-[10px] font-black text-[#4A7C59] uppercase tracking-[0.2em]">
            TMR 2026 Profile
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-[#4A7C59] animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};