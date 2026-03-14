import { useState } from "react";
import { Mail, MapPin, User, Eye, MoreVertical, Pencil, Trash2, Verified } from "lucide-react";
import type { Employee } from "../../../types/employee";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { useEmployeeActions } from "../../../hooks/useEmployeeActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import { toast } from "sonner";

interface EmployeeKanbanCardProps {
  employee: Employee;
  // onAction สำหรับระบุโหมดการทำงานกลับไปยัง EmployeeListPage
  onAction?: (mode: "edit" | "view", employee: Employee) => void;
}

export const EmployeeKanbanCard = ({ employee, onAction }: EmployeeKanbanCardProps) => {
  const { deleteEmployee } = useEmployeeActions();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const getEmploymentTypeStyles = (type: string) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "full_time":
      case "full-time":
        return "bg-emerald-500 text-white";
      case "contract":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-400 text-white";
    }
  };

  const employmentLabel = {
    full_time: "ประจำ",
    contract: "สัญญาจ้าง",
    part_time: "ชั่วคราว",
  }[employee.employment_type?.toLowerCase()] || employee.employment_type;

  // ฟังก์ชันยืนยันการลบผ่าน useEmployeeActions
  const confirmDelete = () => {
    // สั่งรัน Logic การลบพร้อมรับมือ Error และ Success
    deleteMutation.mutate(employee.id);
    setShowDeleteAlert(false);
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // เรียกใช้งาน API delete ผ่าน axios ที่เราตั้งค่าไว้
      return await api.delete(`/api/employees/${id}/`);
    },
    onSuccess: () => {
      toast.success("ลบข้อมูลพนักงานเรียบร้อยแล้ว");
      // รีเฟรชข้อมูลในหน้า List
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: any) => {
      // ดึงข้อความ "คุณไม่สามารถลบบัญชี Admin ของตัวเองได้" จาก Backend
      const errorMessage = error.response?.data?.detail || "เกิดข้อผิดพลาดในการลบข้อมูล";
      toast.error("ลบไม่สำเร็จ", {
        description: errorMessage
      });
    },
  });

  return (
    <>
      <Card
        // คลิกที่ Card โดยตรงให้เปิดโหมด View เสมอ
        onClick={() => onAction?.("view", employee)}
        className={cn(
          "group cursor-pointer transition-all duration-500 relative overflow-hidden",
          "bg-white/80 backdrop-blur-md border-white/50 shadow-soft-double hover:shadow-2xl hover:-translate-y-1",
          "rounded-[2.5rem] border h-full"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#4A7C59]/20 to-transparent -z-0" />

        <CardContent className="p-6 relative z-10 flex flex-col items-center">
          {/* Actions Menu */}
          <div className="absolute top-4 right-4 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white shadow-sm text-[#2D3748]/60 transition-all outline-none"
                  onClick={(e) => e.stopPropagation()} // ป้องกัน event bubbling ไปยัง Card
                >
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl border-none bg-white/95 backdrop-blur-xl shadow-2xl font-thai">

                {/* ปุ่ม View ใน Dropdown */}
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer hover:bg-[#4A7C59]/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.("view", employee);
                  }}
                >
                  <Eye size={16} className="text-[#4A7C59]" />
                  <span className="font-bold text-sm text-[#2D3748]">ดูรายละเอียด</span>
                </DropdownMenuItem>

                {/* ปุ่ม Edit ใน Dropdown */}
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer hover:bg-[#4A7C59]/5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.("edit", employee);
                  }}
                >
                  <Pencil size={16} className="text-blue-500" />
                  <span className="font-bold text-sm text-[#2D3748]">แก้ไขข้อมูล</span>
                </DropdownMenuItem>

                <div className="h-px bg-[#2D3748]/5 my-1" />

                {/* ปุ่ม Delete ใน Dropdown */}
                <DropdownMenuItem
                  className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer hover:bg-red-50 text-red-500 focus:bg-red-50 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteAlert(true);
                  }}
                >
                  <Trash2 size={16} />
                  <span className="font-bold text-sm font-thai">ลบพนักงาน</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 1. ส่วนรูปภาพ (Avatar) */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg group-hover:shadow-xl transition-all duration-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border border-slate-100">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={employee.first_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#4A7C59]/5 text-[#4A7C59]/30">
                    <User size={48} strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
              <Verified size={18} className="text-[#4A7C59] fill-[#4A7C59]/10" />
            </div>
          </div>

          {/* 2. ข้อมูลพนักงาน */}
          <div className="text-center w-full space-y-1">
            <Badge className={cn("mb-2 px-3 py-0 rounded-lg font-thai font-bold text-[9px] border-none shadow-none", getEmploymentTypeStyles(employee.employment_type))}>
              {employmentLabel}
            </Badge>
            <h3 className="font-thai font-black text-xl text-[#2D3748] truncate">
              {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-[#4A7C59] text-[11px] font-black uppercase tracking-widest bg-[#4A7C59]/5 py-1 px-3 rounded-full inline-block">
              {employee.position_name || "General Staff"}
            </p>
          </div>

          {/* 3. ส่วนข้อมูลการติดต่อ */}
          <div className="mt-4 w-full grid grid-cols-1 gap-1 border-t border-slate-100 pt-4">
            {/* Email Row */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#4A7C59]/5 transition-colors duration-300">
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <Mail size={12} className="text-[#2D3748]/40" />
              </div>
              <span className="text-[11px] font-medium text-[#2D3748]/80 truncate flex-1">
                {employee.email || "No Email"}
              </span>
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#4A7C59]/5 transition-colors duration-300">
              <div className="bg-slate-50 p-1.5 rounded-lg">
                <MapPin size={12} className="text-[#2D3748]/40" />
              </div>
              <span className="text-[11px] font-medium text-[#2D3748]/80 truncate flex-1">
                {employee.department_name || "TMR HQ"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AlertDialog สำหรับยืนยันการลบข้อมูลบุคลากร */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="rounded-[2rem] border-none bg-white/95 backdrop-blur-xl font-thai shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-[#2D3748]">
              ยืนยันการลบข้อมูลพนักงาน?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium text-[#2D3748]/60">
              คุณกำลังจะลบข้อมูลของ <span className="text-[#4A7C59] font-bold">{employee.first_name} {employee.last_name}</span> ออกจากระบบ TMR 2026 การดำเนินการนี้ไม่สามารถย้อนกลับได้ และไฟล์ที่เกี่ยวข้องจะถูกถอนการติดตั้งทั้งหมด
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel
              variant={'default'}
              size={'default'}
              className="rounded-xl border-[#2D3748]/10 hover:border-black font-bold hover:bg-slate-100 m-0 hover:text-black">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              variant={'default'}
              size={'default'}
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete();
              }}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 m-0"
            >
              ยืนยันการลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};