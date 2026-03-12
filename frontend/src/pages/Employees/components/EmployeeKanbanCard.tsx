import { User, Mail, Briefcase, Badge } from "lucide-react";
import type { Employee } from "../../../types/employee";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface EmployeeKanbanCardProps {
  employee: Employee;
  onClick?: (employee: Employee) => void;
}

export const EmployeeKanbanCard = ({ employee, onClick }: EmployeeKanbanCardProps) => {
  // ฟังก์ชันช่วยเลือกสี Badge ตามประเภทการจ้างงาน (Employment Type)
  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME": return "bg-sage-light text-sage border-sage/20";
      case "CONTRACT": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Card 
      onClick={() => onClick?.(employee)}
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "bg-white border-slate-200/60",
        "shadow-soft-double hover:shadow-xl hover:-translate-y-1", // ใช้ Soft Double Shadow ตาม Spec
        "hover:border-sage/30" // Action state ใช้สี Sage Green
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-charcoal group-hover:bg-sage-light group-hover:text-sage transition-colors">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-thai font-semibold text-charcoal leading-none mb-1">
                {employee.first_name} {employee.last_name}
              </h3>
              <Badge className={cn("font-thai font-normal text-[10px] px-2 py-0", getEmploymentTypeColor(employee.employment_type))}>
                {employee.employment_type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-thai">
            <Briefcase size={14} className="text-slate-400" />
            <span>{employee.position} • {employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail size={14} className="text-slate-400" />
            <span className="truncate">{employee.email}</span>
          </div>
        </div>

        {/* การตกแต่งขอบล่างด้วยสี Sage เมื่อ Hover เพื่อความพรีเมียม */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
          <span className="text-[10px] font-medium text-slate-300 group-hover:text-sage transition-colors uppercase tracking-wider">
            View Details
          </span>
        </div>
      </CardContent>
    </Card>
  );
};