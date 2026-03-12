import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  UserPlus,
  SlidersHorizontal,
} from "lucide-react";
import { fetchEmployees } from "../../api/employeeApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { EmployeeKanbanCard } from "./components/EmployeeKanbanCard";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import EmployeeForm from "./components/EmployeeFormView";

const DEPARTMENTS = ["ทั้งหมด", "ฝ่ายผลิต", "ฝ่ายขาย", "ไอที", "บัญชี"];

export default function EmployeeListPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeDept, setActiveDept] = useState("ทั้งหมด");
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- 1. Header & Primary Actions --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#2D3748] tracking-tight">
            บุคลากร <span className="text-[#4A7C59]">TMR</span>
          </h1>
          <p className="text-[#2D3748]/60 font-medium">
            จัดการและติดตามข้อมูลทีมงานของคุณในระบบอัจฉริยะ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-white/20">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === "kanban" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:bg-white/50"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === "list" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:bg-white/50"
              )}
            >
              <ListIcon size={20} />
            </button>
          </div>

          <Button onClick={() => setIsDialogOpen(true)} className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-2xl h-14 px-8 shadow-lg shadow-[#4A7C59]/20 gap-3 font-bold text-lg active:scale-95 transition-all">
            <UserPlus size={22} />
            เพิ่มพนักงาน
          </Button>
        </div>

        {/* shadcn UI Dialog - ขั้นสุด */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] p-0 border-none bg-transparent shadow-none">
            {/* คอนเทนเนอร์หลักแบบ Glassmorphism */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative overflow-hidden">

              {/* ตกแต่ง Background ภายใน Dialog */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none" />

              <DialogHeader className="relative z-10 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#4A7C59]/10 rounded-2xl">
                    <UserPlus className="text-[#4A7C59]" size={28} />
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-3xl font-black text-[#2D3748] tracking-tight">
                      สร้างโปรไฟล์บุคลากร
                    </DialogTitle>
                    <DialogDescription className="text-[#2D3748]/60 font-medium">
                      กรอกข้อมูลเบื้องต้นเพื่อเริ่มต้นใช้งานระบบ TMR 2026
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Form Body */}
              <div className="relative z-10">
                <EmployeeForm onSuccess={() => setIsDialogOpen(false)} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* --- 2. Intelligent Search & Quick Filters --- */}
      <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/40 shadow-soft-double flex flex-col xl:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3748]/20 group-focus-within:text-[#4A7C59] transition-colors" size={22} />
          <Input
            placeholder="ค้นหาพนักงานด้วยชื่อ, รหัส หรือแผนก..."
            className="h-16 pl-16 border-none bg-transparent text-lg placeholder:text-[#2D3748]/20 focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={cn(
                "px-6 h-12 rounded-2xl whitespace-nowrap font-bold text-sm transition-all",
                activeDept === dept
                  ? "bg-white text-[#4A7C59] shadow-sm ring-1 ring-[#4A7C59]/10"
                  : "text-[#2D3748]/40 hover:bg-white/40 hover:text-[#2D3748]"
              )}
            >
              {dept}
            </button>
          ))}
          <div className="w-px h-8 bg-[#2D3748]/10 mx-2 hidden xl:block" />
          <Button variant="ghost" className="h-12 rounded-2xl gap-2 text-[#2D3748]/60 font-bold hover:bg-white/40">
            <SlidersHorizontal size={18} />
            ตัวกรองขั้นสูง
          </Button>
        </div>
      </div>

      {/* --- 3. Content Area --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-[#4A7C59]/20 border-t-[#4A7C59] rounded-full animate-spin" />
          <p className="text-[#2D3748]/40 font-bold animate-pulse">กำลังเตรียมข้อมูล...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-visible">
          {viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {employees?.map((emp) => (
                <EmployeeKanbanCard key={emp.id} employee={emp} />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-soft-double overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#2D3748] text-white">
                  <tr>
                    <th className="px-8 py-5 font-bold">พนักงาน</th>
                    <th className="px-8 py-5 font-bold">แผนก</th>
                    <th className="px-8 py-5 font-bold">ตำแหน่ง</th>
                    <th className="px-8 py-5 font-bold text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3748]/5">
                  {employees?.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#4A7C59]/5 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                            {emp.avatar ? (
                              <img src={emp.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sage font-bold text-sm uppercase">{emp.first_name[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#2D3748]">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-[#2D3748]/40">{emp.employee_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-medium text-[#2D3748]/60">{emp.department_name}</td>
                      <td className="px-8 py-4 font-medium text-[#2D3748]/60">{emp.position_name}</td>
                      <td className="px-8 py-4 text-right text-[#4A7C59] font-bold cursor-pointer hover:underline">รายละเอียด</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}