// frontend/src/pages/Employees/components/EmployeeListHeader.tsx
import { Search, SlidersHorizontal, UserPlus, LayoutGrid, List as ListIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";

interface Props {
  departments: string[];
  activeDept: string;
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
  onDeptChange: (dept: string) => void;
  onAddClick: () => void;
}

export const EmployeeListHeader = ({ departments, activeDept, viewMode, onViewModeChange, onDeptChange, onAddClick }: Props) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#2D3748] tracking-tight">บุคลากร <span className="text-[#4A7C59]">TMR</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button onClick={() => onViewModeChange("kanban")} className={cn("p-2.5 rounded-xl transition-all", viewMode === "kanban" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40")}><LayoutGrid size={20} /></button>
            <button onClick={() => onViewModeChange("list")} className={cn("p-2.5 rounded-xl transition-all", viewMode === "list" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40")}><ListIcon size={20} /></button>
          </div>
          <Button onClick={onAddClick} className="bg-[#4A7C59] text-white rounded-2xl h-14 px-8 shadow-lg gap-3 font-bold font-thai"><UserPlus size={22} /> เพิ่มพนักงาน</Button>
        </div>
      </div>
      <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/40 shadow-soft-double flex flex-col xl:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3748]/20 group-focus-within:text-[#4A7C59]" size={22} />
          <Input placeholder="ค้นหาพนักงาน..." className="h-16 pl-16 border-none bg-transparent text-lg focus-visible:ring-0 font-thai" />
        </div>
        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {departments.map((dept) => (
            <button key={dept} onClick={() => onDeptChange(dept)} className={cn("px-6 h-12 rounded-2xl whitespace-nowrap font-bold text-sm transition-all font-thai", activeDept === dept ? "bg-white text-[#4A7C59] shadow-sm ring-1 ring-[#4A7C59]/10" : "text-[#2D3748]/40")}>{dept}</button>
          ))}
          <Button variant="ghost" className="h-12 rounded-2xl gap-2 text-[#2D3748]/60 font-bold font-thai"><SlidersHorizontal size={18} /> ตัวกรองขั้นสูง</Button>
        </div>
      </div>
    </div>
  );
};