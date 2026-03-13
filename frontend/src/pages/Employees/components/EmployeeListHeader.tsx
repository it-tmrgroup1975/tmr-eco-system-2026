// frontend/src/pages/Employees/components/EmployeeListHeader.tsx
import { Search, SlidersHorizontal, UserPlus, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import { DepartmentCombobox } from "./DepartmentCombobox"; // นำเข้าคอมโพเนนต์ที่สร้างขึ้น
import type { Department } from "../../../types/employee";

interface Props {
  departments: Department[]; // เปลี่ยนจาก string[] เป็น Department[] เพื่อใช้ ID-Based
  activeDept: string;
  viewMode: "kanban" | "list";
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "kanban" | "list") => void;
  onDeptChange: (id: string) => void; // เปลี่ยนชื่อพารามิเตอร์เป็น id เพื่อความชัดเจน
  onAddClick: () => void;
  onAdvancedFilterClick?: () => void;
}

export const EmployeeListHeader = ({ 
  departments, 
  activeDept, 
  viewMode, 
  searchTerm,
  onSearchChange,
  onViewModeChange, 
  onDeptChange, 
  onAddClick,
  onAdvancedFilterClick 
}: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#2D3748] tracking-tight">
            บุคลากร <span className="text-[#4A7C59]">TMR</span>
          </h1>
          <p className="text-[#2D3748]/50 font-thai font-medium">จัดการข้อมูลพนักงานและโครงสร้างองค์กร</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-sm">
            <button 
              onClick={() => onViewModeChange("kanban")} 
              className={cn("p-2.5 rounded-xl transition-all", viewMode === "kanban" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:text-[#2D3748]/60")}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => onViewModeChange("list")} 
              className={cn("p-2.5 rounded-xl transition-all", viewMode === "list" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:text-[#2D3748]/60")}
            >
              <ListIcon size={20} />
            </button>
          </div>
          <Button onClick={onAddClick} className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-2xl h-14 px-8 shadow-lg gap-3 font-bold font-thai transition-all hover:scale-[1.02] active:scale-95">
            <UserPlus size={22} /> เพิ่มพนักงาน
          </Button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/40 shadow-soft-double flex flex-col xl:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3748]/20 group-focus-within:text-[#4A7C59] transition-colors" size={22} />
          <Input 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาพนักงานด้วยรหัส, ชื่อ หรือตำแหน่ง..." 
            className="h-16 pl-16 border-none bg-transparent text-lg focus-visible:ring-0 font-thai placeholder:text-[#2D3748]/20" 
          />
        </div>

        <div className="flex items-center gap-2 p-1">
          {/* ใช้ DepartmentCombobox แทนปุ่มรายการแบบเดิม */}
          <DepartmentCombobox 
            departments={departments}
            activeDept={activeDept}
            onDeptChange={onDeptChange}
          />
          
          <div className="w-px h-8 bg-[#2D3748]/10 mx-2 hidden xl:block" />
          
          <Button 
            variant="ghost" 
            onClick={onAdvancedFilterClick}
            className="h-12 rounded-2xl gap-2 text-[#2D3748]/60 font-bold font-thai hover:bg-[#4A7C59]/10 hover:text-[#4A7C59]"
          >
            <SlidersHorizontal size={18} /> <span className="hidden md:inline">ตัวกรองขั้นสูง</span>
          </Button>
        </div>
      </div>
    </div>
  );
};