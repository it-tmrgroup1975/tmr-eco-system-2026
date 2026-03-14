import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  FileText,
  AlertCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

// 1. นำเข้า Store และ UI Components สำหรับยืนยันการ Logout
import { useAuthStore } from '../../store/authStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

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

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore(); // 2. ดึงข้อมูล User และฟังก์ชัน logout

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
            const isActive = location.pathname === item.href;
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
          {/* ส่วนข้อมูล Profile */}
          <Link to="/profile" className={cn("flex items-center hover:bg-white/5 p-2 rounded-xl transition-colors", isSidebarOpen ? "gap-3" : "justify-center")}>
            <Avatar className="h-10 w-10 border-2 border-[#4A7C59]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#4A7C59] text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-400 truncate">ID: {user?.id || '67001'}</p>
              </div>
            )}
          </Link>

          {/* 3. ปุ่ม Logout พร้อม Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full mt-4 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all",
                  !isSidebarOpen && "p-0 h-10 w-10 mx-auto block flex items-center justify-center"
                )}
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2rem] border-none font-['IBM_Plex_Sans_Thai']">
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการออกจากระบบ?</AlertDialogTitle>
                <AlertDialogDescription>
                  คุณต้องการออกจากระบบ TMR Portal ใช่หรือไม่?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  variant='default' size={'default'} className="rounded-xl border-slate-200">ยกเลิก</AlertDialogCancel>
                <AlertDialogAction
                  variant='default' size={'default'}
                  onClick={logout}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  ยืนยัน
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className={cn(
        "transition-all duration-500 min-h-screen pb-20 md:pb-0",
        isSidebarOpen ? "md:ml-72" : "md:ml-20"
      )}>
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30 shadow-sm backdrop-blur-xl bg-white/80">
          <span className="font-bold text-[#2D3748]">TMR ECO SYSTEM</span>
          <Link to="/profile">
            <Avatar className="h-8 w-8 border border-[#4A7C59]/20">
              <AvatarFallback className="bg-[#4A7C59] text-white text-[10px]">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </Link>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
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