// src/pages/Dashboard/components/AttendanceWidget.tsx
import { Clock, Fingerprint } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function AttendanceWidget() {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-soft-double border border-white/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-charcoal flex items-center gap-2">
          <Clock className="text-sage" size={20} /> ลงเวลาทำงาน
        </h3>
        <span className="text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
      </div>
      
      <div className="text-center py-4">
        <div className="text-4xl font-bold text-charcoal mb-2">08:45:12</div>
        <p className="text-sm text-charcoal/40 mb-6">วันพฤหัสบดีที่ 12 มีนาคม 2569</p>
        
        <Button className="w-full bg-sage hover:bg-[#3d664a] h-14 rounded-xl shadow-lg shadow-sage/20 text-lg font-bold gap-3">
          <Fingerprint size={24} /> ลงชื่อเข้างาน
        </Button>
      </div>
    </div>
  );
}