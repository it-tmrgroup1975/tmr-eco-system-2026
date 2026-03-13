// frontend/src/pages/Employees/components/EmployeeTableView.tsx
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import type { Employee } from "../../../types/employee";

interface Props {
  employees: Employee[];
  onAction: (mode: "edit" | "view", emp: Employee) => void;
  onDelete: (id: number) => void;
}

export const EmployeeTableView = ({ employees, onAction, onDelete }: Props) => (
  <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-soft-double overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2D3748] text-white/90">
          <tr>
            <th className="px-10 py-6 font-thai text-sm uppercase">พนักงาน</th>
            <th className="px-10 py-6 font-thai text-sm uppercase">แผนก</th>
            <th className="px-10 py-6 font-thai text-sm uppercase">ตำแหน่ง</th>
            <th className="px-10 py-6 font-thai text-sm uppercase text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2D3748]/5">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-[#4A7C59]/5 transition-all group">
              <td className="px-10 py-5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] overflow-hidden flex items-center justify-center border-2 border-white shadow-md">
                    {emp.avatar ? <img src={emp.avatar} className="w-full h-full object-cover" /> : <span className="text-[#4A7C59] font-black">{emp.first_name[0]}</span>}
                  </div>
                  <div>
                    <p className="font-thai font-bold text-[#2D3748] text-lg">{emp.first_name} {emp.last_name}</p>
                    <p className="text-[11px] font-black text-[#2D3748]/30 tracking-tighter uppercase">ID: {emp.employee_id || emp.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-5">
                <span className="font-thai font-bold text-sm text-[#2D3748]/60 uppercase">{emp.department_name || "ไม่ระบุแผนก"}</span>
              </td>
              <td className="px-10 py-5 italic font-thai font-bold text-sm text-[#4A7C59]">{emp.position_name || "ไม่ระบุตำแหน่ง"}</td>
              <td className="px-10 py-5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><button className="p-2.5 text-[#2D3748]/20 hover:text-[#4A7C59]"><MoreVertical size={20} /></button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl font-thai">
                    <DropdownMenuItem className="gap-3 p-3 rounded-xl" onClick={() => onAction("view", emp)}><Eye size={18} /> ดูรายละเอียด</DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 p-3 rounded-xl" onClick={() => onAction("edit", emp)}><Pencil size={18} /> แก้ไขข้อมูล</DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 p-3 rounded-xl text-red-500" onClick={() => onDelete(emp.id)}><Trash2 size={18} /> ลบพนักงาน</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);