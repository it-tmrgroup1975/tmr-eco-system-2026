import { Mail, Phone, MoreVertical, MapPin } from "lucide-react";
import { cn } from "../../../lib/utils";

interface Employee {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
    username: string;
    department_name: string;
    position_name: string;
    employment_type: string;
    email?: string;
    phone?: string;
    avatar?: string;
}

export function EmployeeKanbanCard({ employee }: { employee: Employee }) {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-5 shadow-soft-double border border-white/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
            {/* 1. Card Decoration & Status Tag */}
            <div className="absolute top-0 right-0 p-4">
                <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm",
                    employee.employment_type === "Full-time"
                        ? "bg-[#4A7C59]/10 text-[#4A7C59] border border-[#4A7C59]/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                )}>
                    {employee.employment_type}
                </span>
            </div>

            <div className="flex gap-5 items-start">
                {/* 2. Avatar Section (อ้างอิง Odoo Concept - image_39b83c.jpg) */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] border-2 border-white overflow-hidden shadow-md">
                        {employee.avatar ? (
                            <img
                                src={employee.avatar}
                                alt={employee.first_name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} // กันรูปพัง
                            />
                        ) : (
                            // ถ้าไม่มีรูป ให้แสดงตัวอักษรแรกของชื่อบนพื้นหลัง Sage
                            <div className="w-full h-full flex items-center justify-center bg-sage/10 text-sage font-bold text-2xl uppercase">
                                {employee.first_name[0]}
                            </div>
                        )}
                    </div>
                    {/* Online/Offline Status Indicator (อ้างอิง Odoo) */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" title="Online" />
                </div>

                {/* 3. Employee Info Section */}
                <div className="flex-1 space-y-1 pr-6">
                    <h3 className="text-lg font-black text-[#2D3748] leading-tight group-hover:text-[#4A7C59] transition-colors line-clamp-1">
                        {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-[#4A7C59] text-xs font-bold italic tracking-wide">
                        {employee.position_name || "ตำแหน่งงาน"}
                    </p>

                    <div className="pt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-[#2D3748]/50 group-hover:text-[#2D3748]/80 transition-colors">
                            <Mail size={14} className="shrink-0" />
                            <span className="text-[11px] truncate font-medium">
                                {employee.email || `${employee.username}@tmr-eco.com`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#2D3748]/50 group-hover:text-[#2D3748]/80 transition-colors">
                            <Phone size={14} className="shrink-0" />
                            <span className="text-[11px] font-medium">
                                {employee.phone || "02-XXX-XXXX"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Action Buttons (ปรากฏเมื่อ Hover) */}
            <div className="mt-4 pt-4 border-t border-[#2D3748]/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 text-[#2D3748]/40">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold uppercase">{employee.department_name}</span>
                </div>
                <button className="p-2 hover:bg-[#4A7C59]/10 rounded-xl text-[#2D3748]/40 hover:text-[#4A7C59] transition-all">
                    <MoreVertical size={18} />
                </button>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#4A7C59]/5 rounded-full blur-2xl group-hover:bg-[#4A7C59]/10 transition-colors" />
        </div>
    );
}