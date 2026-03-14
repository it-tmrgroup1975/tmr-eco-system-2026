// frontend/src/pages/Employees/components/EmployeeSkeleton.tsx
import { Card, CardContent } from "../../../components/ui/card";

export const EmployeeSkeleton = () => {
  return (
    <Card className="relative overflow-hidden border-none bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-soft-double animate-pulse">
      {/* ประดับพื้นหลังด้วยวงกลมจางๆ ให้เข้ากับธีมหลัก */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4A7C59]/5 rounded-full blur-2xl" />
      
      <CardContent className="p-8 space-y-6">
        {/* ส่วนหัว: รูปภาพและชื่อ */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-[2rem] bg-slate-200/60 shadow-inner" />
          <div className="space-y-2 w-full flex flex-col items-center">
            <div className="h-5 bg-slate-200/80 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-100/60 rounded-md w-1/2" />
          </div>
        </div>

        {/* ส่วนข้อมูลรายละเอียด */}
        <div className="space-y-3 pt-2">
          {/* จำลองแถบแผนก */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-slate-200/60" />
            <div className="h-3 bg-slate-100/60 rounded-md w-2/3" />
          </div>
          
          {/* จำลองแถบตำแหน่ง */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-slate-200/60" />
            <div className="h-3 bg-slate-100/60 rounded-md w-1/2" />
          </div>
        </div>

        {/* ส่วนท้าย: ปุ่มหรือสถานะ */}
        <div className="pt-4 flex justify-between items-center border-t border-slate-100/50">
          <div className="h-6 bg-[#4A7C59]/10 rounded-full w-20" />
          <div className="h-8 w-8 bg-slate-200/60 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};