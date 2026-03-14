import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom'; // 1. เพิ่ม Outlet
import {
  LayoutDashboard,
  Clock,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

import { useAuthStore } from '../../store/authStore';
import { LogoutDialog } from './LogoutDialog';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Attendance', href: '/attendance', icon: Clock },
  { title: 'My Payslips', href: '/payslips', icon: FileText },
  { title: 'Report Incident', href: '/report', icon: AlertCircle },
];

const AppLayout = () => { // 2. ลบ { children } props ออก
  const location = useLocation();
  const { user } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_expanded', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-['IBM_Plex_Sans_Thai'] text-[#2D3748]">
      {/* --- Desktop Sidebar --- */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-[#2D3748] text-white transition-all duration-500 ease-in-out hidden md:flex flex-col",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-[#4A7C59]">TMR Portal</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-white/10 ml-auto"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-3 mt-4">
          {navItems.map((item) => {
            // เช็ค Active State ให้ครอบคลุม Sub-routes (เช่น /dashboard/payslips/1)
            const isActive = item.href === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.href);

            return (
              <Link key={item.href} to={item.href}>
                <div className={cn(
                  "flex items-center p-3 rounded-lg transition-colors group",
                  isActive
                    ? "bg-[#4A7C59] text-white"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                )}>
                  <item.icon size={24} className={cn(isActive ? "text-white" : "group-hover:text-white")} />
                  {isSidebarOpen && <span className="ml-4 font-medium">{item.title}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/profile" className={cn("flex items-center hover:bg-white/5 p-2 rounded-xl transition-colors", isSidebarOpen ? "gap-3" : "justify-center")}>
            <Avatar className="h-10 w-10 border-2 border-[#4A7C59]">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-[#4A7C59] text-white text-xs">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-gray-400 truncate">ID: {user?.employee_id || 'N/A'}</p>
              </div>
            )}
          </Link>
          <LogoutDialog isSidebarOpen={isSidebarOpen} />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={cn(
        "transition-all duration-500 min-h-screen pb-20 md:pb-0",
        isSidebarOpen ? "md:ml-72" : "md:ml-20"
      )}>
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 border-b sticky top-0 z-30 backdrop-blur-xl shadow-sm">
          <span className="font-bold text-[#2D3748]">TMR ECO SYSTEM</span>
          <Link to="/profile">
            <Avatar className="h-8 w-8 border border-[#4A7C59]/20">
              <AvatarImage src={user?.avatar || ""} alt={user?.first_name} />
              <AvatarFallback className="bg-[#4A7C59] text-white text-[10px]">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* 3. ใช้ Outlet แทน children เพื่อแสดงผล Nested Routes */}
          <Outlet />
        </div>
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-[#4A7C59]" : "text-gray-400"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;