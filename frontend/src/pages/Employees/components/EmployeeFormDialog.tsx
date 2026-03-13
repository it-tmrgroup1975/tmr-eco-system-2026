// frontend/src/pages/Employees/components/EmployeeFormDialog.tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import EmployeeForm from "./EmployeeFormView";
import { UserPlus, Pencil, Eye } from "lucide-react";
import type { Employee } from "../../../types/employee";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  employee: Employee | null;
  onSuccess: () => void;
}

export const EmployeeFormDialog = ({ isOpen, onOpenChange, mode, employee, onSuccess }: Props) => (
  
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[700px] p-0 border-none bg-transparent shadow-none">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/50 relative">
        <DialogHeader className="mb-8 font-thai">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4A7C59]/10 rounded-2xl text-[#4A7C59]">
              {mode === "create" && <UserPlus size={28} />}
              {mode === "edit" && <Pencil size={28} />}
              {mode === "view" && <Eye size={28} />}
            </div>
            <div className="text-left">
              <DialogTitle className="text-3xl font-black text-[#2D3748]">
                {mode === "create" ? "สร้างโปรไฟล์บุคลากร" : mode === "edit" ? "แก้ไขโปรไฟล์" : "ข้อมูลบุคลากร"}
              </DialogTitle>
              <DialogDescription className="text-[#2D3748]/60">
                {mode === "view" ? "ข้อมูลการทำงานและรายละเอียดส่วนบุคคล" : "กรอกข้อมูลเพื่ออัปเดตระบบ TMR 2026"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <EmployeeForm employee={employee} mode={mode} onSuccess={onSuccess} />
      </div>
    </DialogContent>
  </Dialog>
);