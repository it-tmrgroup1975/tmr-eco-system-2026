// frontend/src/pages/Employees/components/AdvancedFilterSheet.tsx
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription
} from "../../../components/ui/sheet";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import {
  RotateCcw,
  Briefcase,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Filter
} from "lucide-react";
import { cn } from "../../../lib/utils";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  positions: any[];
  filters: any;
  onApply: (filters: any) => void;
}

export function AdvancedFilterSheet({ isOpen, onOpenChange, positions, filters, onApply }: Props) {
  // ใช้ Local State เพื่อประสิทธิภาพสูงสุด (ลดการยิง API ขณะเลือก)
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync ค่าจาก Global เมื่อเปิด Sheet ขึ้นมาใหม่
  useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  const handleReset = () => {
    const resetValues = {
      employment_type: "",
      position: "",
      start_date: "",
      end_date: ""
    };
    setLocalFilters(resetValues);
    onApply(resetValues);
  };

  const handleApply = () => {
    onApply(localFilters);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 border-l-0 bg-[#F1F5F9]/95 backdrop-blur-xl font-thai flex flex-col h-full overflow-hidden"
      >
        {/* Header Section: Glassmorphism Gradient */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-transparent border-b border-white/40">
          <SheetHeader className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#4A7C59]/10 rounded-2xl text-[#4A7C59] shadow-inner">
                <Filter size={22} />
              </div>
              <SheetTitle className="text-3xl font-black text-[#2D3748] tracking-tight">
                ตัวกรองขั้นสูง
              </SheetTitle>
            </div>
            <SheetDescription className="text-sm font-medium text-[#2D3748]/40 leading-relaxed">
              ปรับแต่งเงื่อนไขเพื่อเจาะจงข้อมูลบุคลากรที่คุณต้องการ
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 space-y-10 scrollbar-hide">

          {/* Section: ลักษณะงาน */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 px-1">
              <Briefcase size={18} className="text-[#4A7C59]" />
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#2D3748]/60">ลักษณะการจ้างงาน</h3>
            </div>

            <div className="grid gap-6 p-6 bg-white/40 border border-white/60 rounded-[2.5rem] shadow-soft-double">
              <div className="space-y-3">
                <Label className="text-[#2D3748] font-bold ml-1 text-sm">ประเภทสัญญา</Label>
                <Select
                  value={localFilters.employment_type}
                  onValueChange={(v) => setLocalFilters({ ...localFilters, employment_type: v })}
                >
                  <SelectTrigger className="rounded-2xl h-14 bg-white/80 border-none shadow-sm focus:ring-2 focus:ring-[#4A7C59]/20 transition-all">
                    <SelectValue placeholder="แสดงทั้งหมด" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/40 shadow-xl font-thai">
                    <SelectItem value="full_time">พนักงานประจำ (Full-time)</SelectItem>
                    <SelectItem value="contract">สัญญาจ้าง (Contract)</SelectItem>
                    <SelectItem value="part_time">พนักงาน Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[#2D3748] font-bold ml-1 text-sm">ตำแหน่งงาน</Label>
                <Select
                  value={localFilters.position}
                  onValueChange={(v) => setLocalFilters({ ...localFilters, position: v })}
                >
                  <SelectTrigger className="rounded-2xl h-14 bg-white/80 border-none shadow-sm focus:ring-2 focus:ring-[#4A7C59]/20 transition-all">
                    <SelectValue placeholder="เลือกตำแหน่ง" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/40 shadow-xl font-thai h-[250px]">
                    {positions.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section: วันที่เข้างาน (Responsive Fix: ป้องกัน Date หลุดเฟรม) */}
          <div className="space-y-6 pb-20 sm:pb-0">
            <div className="flex items-center gap-2.5 px-1">
              <Calendar size={18} className="text-[#4A7C59]" />
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#2D3748]/60">ระยะเวลาการทำงาน</h3>
            </div>

            <div className="shadow-soft-double">
              <div className="space-y-3">
                <Label className="text-[#2D3748] font-bold ml-1 text-xs uppercase tracking-wide opacity-80">
                  ช่วงวันที่เริ่มทำงาน
                </Label>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  {/* Input ตัวแรก */}
                  <div className="relative flex-1 w-full">
                    <Input
                      type="date"
                      value={localFilters.start_date}
                      onChange={(e) => setLocalFilters({ ...localFilters, start_date: e.target.value })}
                      className="rounded-xl h-10 bg-white/90 border-none shadow-sm px-3 w-full focus-visible:ring-2 focus-visible:ring-[#4A7C59]/20 transition-all text-sm"
                    />
                  </div>

                  {/* ตัวเชื่อม - ปรับขนาดและสีให้เบาลง */}
                  <div className="hidden sm:flex items-center justify-center text-[#2D3748]/30 px-1">
                    <ArrowRight size={16} />
                  </div>

                  {/* Divider สำหรับมือถือ - ใช้ margin ช่วยให้ไม่ติด input เกินไป */}
                  <div className="sm:hidden w-full h-px bg-[#2D3748]/5 my-1" />

                  {/* Input ตัวที่สอง */}
                  <div className="relative flex-1 w-full">
                    <Input
                      type="date"
                      value={localFilters.end_date}
                      onChange={(e) => setLocalFilters({ ...localFilters, end_date: e.target.value })}
                      className="rounded-xl h-10 bg-white/90 border-none shadow-sm px-3 w-full focus-visible:ring-2 focus-visible:ring-[#4A7C59]/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section: Fixed at Bottom with Safe Area */}
        <div className="p-6 sm:p-8 bg-white/80 backdrop-blur-md border-t border-white/40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex gap-4 max-w-full">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-14 px-6 rounded-2xl font-bold text-[#2D3748]/30 hover:text-[#2D3748] hover:bg-slate-100/50 transition-all active:scale-95"
            >
              <RotateCcw size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">ล้างตัวกรอง</span>
            </Button>

            <Button
              onClick={handleApply}
              className="flex-1 bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-2xl h-14 font-black shadow-[0_12px_24px_-8px_rgba(74,124,89,0.4)] transition-all hover:scale-[1.02] active:scale-95 gap-3"
            >
              แสดงผลลัพธ์พนักงาน
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}