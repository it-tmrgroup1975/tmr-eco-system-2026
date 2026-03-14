import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Clock,
  Receipt,
  AlertTriangle,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-thai flex flex-col md:flex-row">

      {/* --- Mobile Top Navigation Bar --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#2D3748] text-white sticky top-0 z-[40] shadow-md">
        <span className="text-xl font-bold text-[#4A7C59]">TMR 2026</span>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- Overlay: ปรับ Z-index ให้ต่ำกว่า Sidebar (z-50) --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[51] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- Sidebar: ปรับ Z-index สูงสุด (z-[60]) และเพิ่ม Mobile Header --- */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-[#2D3748] text-white transition-all duration-500 z-[60] shadow-2xl flex flex-col",
        isCollapsed ? "md:w-20" : "md:w-72",
        isMobileMenuOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full md:translate-x-0"
      )}>
        {/* Header สำหรับทั้ง Desktop และ Mobile (สำหรับปุ่ม X) */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 md:border-none">
          {(!isCollapsed || isMobileMenuOpen) && (
            <span className="text-xl font-bold text-[#4A7C59]">TMR 2026</span>
          )}

          {/* ปุ่มสลับสถานะบน Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* ปุ่มปิดบน Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Content: เพิ่ม overflow-y-auto ป้องกันเมนูจมหายถ้ามีรายการเยอะ */}
        <nav className="flex-1 mt-4 md:mt-10 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-2 pb-10">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/dashboard"} />
            <NavItem to="/employees" icon={<Users size={22} />} label="พนักงาน" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/employees"} />
            <NavItem to="/attendance" icon={<Clock size={22} />} label="ลงเวลาเข้างาน" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/attendance"} />
            <NavItem to="/payroll" icon={<Receipt size={22} />} label="เงินเดือน" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/payroll"} />
            <NavItem to="/incidents" icon={<AlertTriangle size={22} />} label="แจ้งเหตุการณ์" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/incidents"} />
            <NavItem to="/settings" icon={<Settings size={22} />} label="ตั้งค่า" isCollapsed={isCollapsed} isMobile={isMobileMenuOpen} active={pathname === "/settings"} />
          </div>
        </nav>

        {/* Footer: ปุ่มออกจากระบบ */}
        <div className="p-4 border-t border-white/5 bg-[#2D3748]">
          <button
            onClick={logout}
            className="flex items-center w-full p-3 rounded-xl cursor-pointer transition-all duration-300 text-white/60 hover:bg-red-500/10 hover:text-red-400"
          >
            <div className="min-w-[24px]"><LogOut size={22} /></div>
            <span className={cn(
              "ml-4 font-medium transition-opacity duration-500",
              (isCollapsed && !isMobileMenuOpen) && "md:hidden"
            )}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={cn(
        "flex-1 transition-all duration-500 p-4 md:p-8 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-72"
      )}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isCollapsed, isMobile, to, active = false }: any) {
  return (
    <Link to={to}>
      <div className={cn(
        "flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300",
        active
          ? "bg-[#4A7C59] text-white shadow-lg shadow-[#4A7C59]/20"
          : "hover:bg-white/5 text-white/60 hover:text-white"
      )}>
        <div className="min-w-[24px]">{icon}</div>
        <span className={cn(
          "ml-4 font-medium transition-opacity duration-500",
          (isCollapsed && !isMobile) && "md:hidden"
        )}>
          {label}
        </span>
      </div>
    </Link>
  );
}