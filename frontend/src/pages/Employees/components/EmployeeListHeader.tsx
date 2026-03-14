import {
  Search,
  SlidersHorizontal,
  UserPlus,
  LayoutGrid,
  List as ListIcon,
  FileDown,
  FileUp,
  Download // นำเข้าไอคอน Download เพิ่มเติม
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import { DepartmentCombobox } from "./DepartmentCombobox";
import type { Department } from "../../../types/employee";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

interface Props {
  departments: Department[];
  activeDept: string;
  viewMode: "kanban" | "list";
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "kanban" | "list") => void;
  onDeptChange: (id: string) => void;
  onAddClick: () => void;
  onAdvancedFilterClick?: () => void;
  onExportClick: () => void;
  onImportChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // --- เพิ่ม Prop ใหม่สำหรับดาวน์โหลด Template ---
  onDownloadTemplateClick: () => void;
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
  onAdvancedFilterClick,
  onExportClick,
  onImportChange,
  onDownloadTemplateClick // รับมาใช้งาน
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

        <TooltipProvider delayDuration={200}>
          <div className="flex flex-wrap items-center gap-1 bg-[#4A7C59]/25 p-1.5 px-3 rounded-2xl">
            {/* --- ปุ่มดาวน์โหลด Template (ใหม่) --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onDownloadTemplateClick}
                className="border-[#4A7C59]/20 text-[#4A7C59] hover:bg-[#4A7C59]/5 font-bold font-thai transition-all"
                >
                  <Download size={20} />
                  {/* <span className="hidden lg:inline">Template</span> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-thai bg-[#2D3748] text-white border-none shadow-xl">
                <p>ดาวน์โหลดไฟล์ตัวอย่าง (Excel)</p>
              </TooltipContent>
            </Tooltip>

            {/* --- ปุ่ม Export --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onExportClick}
                // className="border-[#2D3748]/10 text-[#2D3748]/60 hover:bg-[#2D3748]/5 rounded-2xl h-14 px-5 gap-2 font-bold font-thai transition-all"
                >
                  <FileDown size={20} className="text-[#4A7C59]" />
                  {/* <span className="hidden sm:inline">Export</span> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-thai bg-[#2D3748] text-white border-none shadow-xl">
                <p>ส่งออกข้อมูลเป็นไฟล์ Excel</p>
              </TooltipContent>
            </Tooltip>

            {/* --- ปุ่ม Import (Hidden Input Trick) --- */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <input
                    type="file"
                    id="header-import-excel"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={onImportChange}
                  />
                  <label htmlFor="header-import-excel">
                    <Button
                      variant="outline"
                      asChild
                    // className="border-[#2D3748]/10 text-[#2D3748]/60 hover:bg-[#2D3748]/5 rounded-2xl h-14 px-5 gap-2 font-bold font-thai cursor-pointer transition-all"
                    >
                      <div>
                        <FileUp size={20} className="text-[#4A7C59]" />
                        {/* <span className="hidden sm:inline">Import</span> */}
                      </div>
                    </Button>
                  </label>
                </div>
              </TooltipTrigger>
              <TooltipContent className="font-thai bg-[#2D3748] text-white border-none shadow-xl">
                <p>นำเข้าข้อมูลพนักงานจาก Excel</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onAddClick}
                className="text-[#3d664a] bg-white shadow-lg font-bold font-thai transition-all hover:scale-[1.02] active:scale-95"
                >
                  <UserPlus size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-thai bg-[#4A7C59] text-white border-none shadow-xl">
                <p>เพิ่มพนักงานใหม่</p>
              </TooltipContent>
            </Tooltip>

            {/* ปุ่มสลับโหมด View (Kanban/List) */}
            <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-[12px] border border-white/20 shadow-sm gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewModeChange("kanban")}
                    className={cn("rounded-2 transition-all", viewMode === "kanban" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:text-[#2D3748]/60")}
                  >
                    <LayoutGrid size={22} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="font-thai bg-[#2D3748] text-white">มุมมองการ์ด</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewModeChange("list")}
                    className={cn("rounded-2 transition-all", viewMode === "list" ? "bg-[#4A7C59] text-white shadow-lg" : "text-[#2D3748]/40 hover:text-[#2D3748]/60")}
                  >
                    <ListIcon size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="font-thai bg-[#2D3748] text-white">มุมมองตาราง</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
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