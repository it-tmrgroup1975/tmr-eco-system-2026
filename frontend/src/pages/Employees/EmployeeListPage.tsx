import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  UserPlus,
  SlidersHorizontal,
  Users,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { EmployeeKanbanCard } from "./components/EmployeeKanbanCard";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import EmployeeForm from "./components/EmployeeFormView";
import { employeeApi } from "../../api/employeeApi";
import { useEmployeeActions } from "../../hooks/useEmployeeActions";
import type { Department, Employee } from "../../types/employee";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const { deleteEmployee } = useEmployeeActions();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeDept, setActiveDept] = useState("ทั้งหมด");

  // 1. ดึงข้อมูลแผนกจริงจาก Backend
  const { data: departmentsData } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const realDepartments = [
    "ทั้งหมด",
    ...(departmentsData?.map((dept) => dept.name) || [])
  ];

  // 2. ดึงข้อมูลพนักงาน
  const { data: employees, isLoading, isError } = useQuery<Employee[]>({
    queryKey: ["employees", activeDept],
    queryFn: () => employeeApi.getAll({
      department: activeDept === "ทั้งหมด" ? undefined : activeDept
    }),
  });

  // --- จุดเปลี่ยนสำคัญ: ฟังก์ชัน Atomic สำหรับจัดการโหมดพนักงาน ---
  const handleOpenForm = (mode: "create" | "edit" | "view", emp: Employee | null = null) => {
    // ล้างค่าเก่าก่อนเสมอเพื่อป้องกัน Race Condition ของ UI
    setSelectedEmployee(null);
    
    // ตั้งค่าใหม่ตามลำดับ
    setFormMode(mode);
    setSelectedEmployee(emp);
    setIsDialogOpen(true);
  };

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
          <p className="text-[#2D3748]/60 font-medium font-thai">จัดการและติดตามข้อมูลทีมงานของคุณในระบบอัจฉริยะ</p>
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

          {/* ปรับปรุงการกดปุ่ม Create: ระบุโหมดให้ชัดเจน */}
          <Button 
            onClick={() => handleOpenForm("create")} 
            className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-2xl h-14 px-8 shadow-lg shadow-[#4A7C59]/20 gap-3 font-bold text-lg active:scale-95 transition-all font-thai"
          >
            <UserPlus size={22} /> เพิ่มพนักงาน
          </Button>
        </div>
      </div>

      {/* --- Search & Real-time Filters --- */}
      <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/40 shadow-soft-double flex flex-col xl:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3748]/20 group-focus-within:text-[#4A7C59] transition-colors" size={22} />
          <Input placeholder="ค้นหาพนักงาน..." className="h-16 pl-16 border-none bg-transparent text-lg focus-visible:ring-0 font-thai" />
        </div>

        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {realDepartments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={cn(
                "px-6 h-12 rounded-2xl whitespace-nowrap font-bold text-sm transition-all font-thai",
                activeDept === dept
                  ? "bg-white text-[#4A7C59] shadow-sm ring-1 ring-[#4A7C59]/10"
                  : "text-[#2D3748]/40 hover:bg-white/40 hover:text-[#2D3748]"
              )}
            >
              {dept}
            </button>
          ))}
          <div className="w-px h-8 bg-[#2D3748]/10 mx-2 hidden xl:block" />
          <Button variant="ghost" className="h-12 rounded-2xl gap-2 text-[#2D3748]/60 font-bold hover:bg-white/40 font-thai">
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
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-thai">ลองใหม่อีกครั้ง</Button>
        </div>
      ) : !employees || employees.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6 bg-white/20 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-white/50 font-thai">
          <div className="p-8 bg-white/50 rounded-full shadow-soft-double">
            <Users size={64} className="text-[#4A7C59]/20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-[#2D3748]">ไม่พบข้อมูลบุคลากรในแผนกนี้</h3>
            <p className="text-[#2D3748]/60 font-medium">คุณสามารถเพิ่มพนักงานใหม่เข้าสู่แผนก {activeDept} ได้ทันที</p>
          </div>
          <Button onClick={() => handleOpenForm("create")} className="bg-[#4A7C59] text-white rounded-xl h-12 px-6 shadow-md hover:shadow-lg transition-all gap-2 font-thai">
            <UserPlus size={20} /> เพิ่มพนักงาน
          </Button>
        </div>
      ) : (
        <div className="flex-1 animate-in fade-in duration-500">
          {viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
              {employees?.map((emp) => (
                <div key={emp.id} className="relative group">
                  <EmployeeKanbanCard
                    employee={emp}
                    onAction={(mode, data) => handleOpenForm(mode, data)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-soft-double overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#2D3748] text-white/90">
                    <tr>
                      <th className="px-10 py-6 font-thai font-black text-sm uppercase tracking-widest border-b border-white/10">พนักงาน</th>
                      <th className="px-10 py-6 font-thai font-black text-sm uppercase tracking-widest border-b border-white/10">แผนก</th>
                      <th className="px-10 py-6 font-thai font-black text-sm uppercase tracking-widest border-b border-white/10">ตำแหน่ง</th>
                      <th className="px-10 py-6 font-thai font-black text-sm uppercase tracking-widest border-b border-white/10 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D3748]/5">
                    {employees?.map((emp: Employee) => (
                      <tr key={emp.id} className="hover:bg-[#4A7C59]/5 transition-all duration-300 group">
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] overflow-hidden flex items-center justify-center border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                {emp.avatar ? (
                                  <img src={emp.avatar} alt={emp.first_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                  <span className="text-[#4A7C59] font-black text-lg uppercase font-thai">{emp.first_name[0]}</span>
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                            </div>
                            <div>
                              <p className="font-thai font-bold text-[#2D3748] text-lg leading-tight group-hover:text-[#4A7C59] transition-colors">
                                {emp.first_name} {emp.last_name}
                              </p>
                              <p className="text-[11px] font-black text-[#2D3748]/30 uppercase tracking-tighter mt-1">
                                ID: {emp.employee_id || emp.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-5">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                            <span className="font-thai font-bold text-sm text-[#2D3748]/60 uppercase tracking-tighter">
                              {emp.department_name || "ไม่ระบุแผนก"}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-5">
                          <span className="font-thai font-bold text-sm text-[#4A7C59] italic">
                            {emp.position_name || "ไม่ระบุตำแหน่ง"}
                          </span>
                        </td>
                        <td className="px-10 py-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2.5 rounded-xl text-[#2D3748]/20 hover:text-[#4A7C59] hover:bg-white transition-all shadow-none hover:shadow-sm">
                                <MoreVertical size={20} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 p-2 rounded-[1.5rem] border-white/40 bg-white/90 backdrop-blur-xl shadow-2xl font-thai">
                              {/* ระบุ View Mode ใน List View */}
                              <DropdownMenuItem 
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#4A7C59]/5 text-[#2D3748]/70 focus:text-[#4A7C59]"
                                onClick={() => handleOpenForm("view", emp)}
                              >
                                <Eye size={18} className="text-[#4A7C59]/40" />
                                <span className="font-bold text-sm">ดูรายละเอียด</span>
                              </DropdownMenuItem>

                              {/* ระบุ Edit Mode ใน List View */}
                              <DropdownMenuItem
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#4A7C59]/5 text-[#2D3748]/70 focus:text-[#4A7C59]"
                                onClick={() => handleOpenForm("edit", emp)}
                              >
                                <Pencil size={18} className="text-[#4A7C59]/40" />
                                <span className="font-bold text-sm">แก้ไขข้อมูล</span>
                              </DropdownMenuItem>

                              <div className="h-px bg-[#2D3748]/5 my-2" />

                              <DropdownMenuItem
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 text-red-500 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDelete(emp.id)}
                              >
                                <Trash2 size={18} className="text-red-400" />
                                <span className="font-bold text-sm">ลบพนักงาน</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- จุดเปลี่ยนสำคัญ: Dialog Logic --- */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          // เมื่อ Dialog ปิดลง ให้ Reset สถานะพนักงานและโหมดทันที
          if (!open) {
            setSelectedEmployee(null);
            setFormMode("create");
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4A7C59]/10 rounded-full blur-3xl pointer-events-none" />
            <DialogHeader className="relative z-10 mb-8 font-thai">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4A7C59]/10 rounded-2xl text-[#4A7C59]">
                  {formMode === "create" && <UserPlus size={28} />}
                  {formMode === "edit" && <Pencil size={28} />}
                  {formMode === "view" && <Eye size={28} />}
                </div>
                <div className="text-left">
                  <DialogTitle className="text-3xl font-black text-[#2D3748] tracking-tight">
                    {formMode === "create" && "สร้างโปรไฟล์บุคลากร"}
                    {formMode === "edit" && "แก้ไขโปรไฟล์บุคลากร"}
                    {formMode === "view" && "ข้อมูลบุคลากร"}
                  </DialogTitle>
                  <DialogDescription className="text-[#2D3748]/60 font-medium">
                    {formMode === "view" ? "ข้อมูลการทำงานและรายละเอียดส่วนบุคคล" : "กรอกข้อมูลเบื้องต้นเพื่ออัปเดตระบบ TMR 2026"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="relative z-10">
              <EmployeeForm
                employee={selectedEmployee}
                mode={formMode} // ส่ง prop mode ไปให้ EmployeeForm ตัดสินใจ disabled หรือซ่อนปุ่ม
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setSelectedEmployee(null);
                  setFormMode("create");
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}