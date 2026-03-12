import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  UserPlus,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { EmployeeKanbanCard } from "./components/EmployeeKanbanCard";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import EmployeeForm from "./components/EmployeeFormView";
import { employeeApi } from "../../api/employeeApi";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";

// --- Skeleton Component สำหรับ Loading State ---
const EmployeeSkeleton = () => (
  <div className="bg-white/40 p-6 rounded-[2rem] border border-white animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="h-3 bg-slate-100 rounded w-full" />
    <div className="h-3 bg-slate-100 rounded w-2/3" />
  </div>
);

export default function EmployeeListPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeDept, setActiveDept] = useState("ทั้งหมด");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { deleteEmployee } = useEmployeeActions();

  // 1. ดึงข้อมูลแผนกจริงจาก Backend (/api/departments/)
  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(), // ตรวจสอบว่ามี method นี้ใน employeeApi
  });

  // สร้าง Array ของแผนกโดยรวม "ทั้งหมด" เข้าไปเป็นตัวเลือกแรก
  const realDepartments = [
    "ทั้งหมด",
    ...(departmentsData?.map((dept: any) => dept.name) || [])
  ];

  // 2. ดึงข้อมูลพนักงาน พร้อมรองรับการ Filter ตามแผนกที่เลือก
  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ["employees", activeDept],
    queryFn: () => employeeApi.getAll({
      department: activeDept === "ทั้งหมด" ? undefined : activeDept
    }),
  });

  // ฟังก์ชันยืนยันการลบ
  const handleDelete = (id: number) => {
    if (confirm("คุณต้องการลบข้อมูลพนักงานท่านนี้ใช่หรือไม่?")) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#2D3748] tracking-tight">
            บุคลากร <span className="text-[#4A7C59]">TMR</span>
          </h1>
          <p className="text-[#2D3748]/60 font-medium">จัดการและติดตามข้อมูลทีมงานของคุณในระบบอัจฉริยะ</p>
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
            <UserPlus size={22} /> เพิ่มพนักงาน
          </Button>
        </div>
      </div>

      {/* --- Search & Real-time Filters --- */}
      <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/40 shadow-soft-double flex flex-col xl:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3748]/20 group-focus-within:text-[#4A7C59] transition-colors" size={22} />
          <Input placeholder="ค้นหาพนักงาน..." className="h-16 pl-16 border-none bg-transparent text-lg focus-visible:ring-0" />
        </div>

        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {realDepartments.map((dept) => (
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

      {/* --- Main Content --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <EmployeeSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="py-20 text-center space-y-4">
          <p className="text-destructive font-bold text-lg font-thai">ขออภัย เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">ลองใหม่อีกครั้ง</Button>
        </div>
      ) : !employees || employees.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6 bg-white/20 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-white/50">
          <div className="p-8 bg-white/50 rounded-full shadow-soft-double">
            <Users size={64} className="text-[#4A7C59]/20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-[#2D3748] font-thai">ไม่พบข้อมูลบุคลากรในแผนกนี้</h3>
            <p className="text-[#2D3748]/60 font-medium font-thai">คุณสามารถเพิ่มพนักงานใหม่เข้าสู่แผนก {activeDept} ได้ทันที</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-[#4A7C59] text-white rounded-xl h-12 px-6 shadow-md hover:shadow-lg transition-all gap-2">
            <UserPlus size={20} /> เพิ่มพนักงาน
          </Button>
        </div>
      ) : (
        <div className="flex-1 animate-in fade-in duration-500">
          {viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {employees.map((emp) => (
                <div key={emp.id} className="relative group">
                  <EmployeeKanbanCard employee={emp} />
                  {/* ปุ่มลบแบบด่วน (Quick Delete) */}
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-soft-double overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#2D3748] text-white">
                  <tr>
                    <th className="px-8 py-5 font-bold font-thai">พนักงาน</th>
                    <th className="px-8 py-5 font-bold font-thai">แผนก</th>
                    <th className="px-8 py-5 font-bold font-thai">ตำแหน่ง</th>
                    <th className="px-8 py-5 font-bold text-right font-thai">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3748]/5">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#4A7C59]/5 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-[#4A7C59] font-bold text-sm uppercase">{emp.first_name[0]}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#2D3748] font-thai">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-[#2D3748]/40">ID: {emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-medium text-[#2D3748]/60 font-thai">{emp.department}</td>
                      <td className="px-8 py-4 font-medium text-[#2D3748]/60 font-thai">{emp.position}</td>
                      <td className="px-8 py-4 text-right text-[#4A7C59] font-bold cursor-pointer hover:underline font-thai">รายละเอียด</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* shadcn UI Dialog ส่วน EmployeeForm คงเดิม */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none" />
            <DialogHeader className="relative z-10 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4A7C59]/10 rounded-2xl">
                  <UserPlus className="text-[#4A7C59]" size={28} />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-3xl font-black text-[#2D3748] tracking-tight font-thai">สร้างโปรไฟล์บุคลากร</DialogTitle>
                  <DialogDescription className="text-[#2D3748]/60 font-medium font-thai">กรอกข้อมูลเบื้องต้นเพื่อเริ่มต้นใช้งานระบบ TMR 2026</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="relative z-10">
              <EmployeeForm onSuccess={() => setIsDialogOpen(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}