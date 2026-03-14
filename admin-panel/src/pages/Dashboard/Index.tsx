// src/pages/Dashboard/Index.tsx
import { useAuthStore } from "../../store/authStore";
import { AttendanceWidget } from "./components/AttendanceWidget";
import { IncidentWidget } from "./components/IncidentWidget";
import { PayslipWidget } from "./components/PayslipWidget";
import { StatsOverview } from "./components/StatsOverview";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  // ดึงข้อมูลผู้ใช้จาก Zustand Store เพื่อแสดงผลแบบ Personalization
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section: ทักทายผู้ใช้งานด้วยชื่อจริงจากระบบ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* แก้ไข Syntax: ใช้ size={20} ภายในปีกกาให้ถูกต้อง */}
            <Sparkles className="text-[#4A7C59]" size={20} />
            <span className="text-sm font-bold text-[#4A7C59] uppercase tracking-wider">
              Smart Resource Management
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#2D3748]">
            สวัสดี, คุณ{user?.first_name || "ผู้ใช้งาน"}
          </h1>
          <p className="text-[#2D3748]/60 mt-1">
            นี่คือภาพรวมการทำงานและสถิติของคุณในวันนี้
          </p>
        </div>

        {/* System Status Indicator */}
        <div className="hidden md:flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 px-4 rounded-2xl border border-white/20 shadow-sm">
          <div className="size-2 bg-[#4A7C59] rounded-full animate-ping" />
          <span className="text-xs font-bold text-[#2D3748]/80">ระบบทำงานปกติ</span>
        </div>
      </div>

      {/* Section 1: สถิติหลัก (Stats Overview) */}
      <StatsOverview />

      {/* Section 2: ส่วนการจัดการประจำวัน (Daily Widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 h-full">
          <AttendanceWidget />
        </div>
        
        <div className="lg:col-span-1 h-full">
          <PayslipWidget />
        </div>
        
        <div className="lg:col-span-1 h-full">
          <IncidentWidget />
        </div>
      </div>
      
      {/* Section 3: แผงวิเคราะห์ข้อมูลด้วย AI (AI Insight Panel) */}
      <div className="bg-[#2D3748] text-white/95 p-10 rounded-[2rem] shadow-soft-double overflow-hidden relative group border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="text-[#4A7C59]" size={24} /> 
              สรุปผลวิเคราะห์ AI ประจำสัปดาห์
            </h3>
            <p className="text-white/70 leading-relaxed text-base">
              สัปดาห์นี้ทีมของคุณมีอัตราการเข้างานตรงเวลาเพิ่มขึ้น <span className="text-[#4A7C59] font-bold">12%</span> และไม่มีรายงานอุบัติเหตุในพื้นที่ก่อสร้าง 
              ระบบแนะนำให้รักษามาตรฐานความปลอดภัยระดับนี้ต่อไปเพื่อรับโบนัสกลุ่มพิเศษประจำเดือนมีนาคม
            </p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl transition-all font-bold whitespace-nowrap active:scale-95 shadow-xl">
            ดูรายงานฉบับเต็ม
          </button>
        </div>
        
        {/* Background Decorative Blur: สร้างมิติแบบ Glassmorphism */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#4A7C59]/20 rounded-full blur-[100px] group-hover:bg-[#4A7C59]/30 transition-colors duration-700" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      </div>
    </div>
  );
}