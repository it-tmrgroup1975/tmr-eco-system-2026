// frontend/src/components/shared/LogoutDialog.tsx
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
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

interface LogoutDialogProps {
  isSidebarOpen: boolean;
}

export const LogoutDialog = ({ isSidebarOpen }: LogoutDialogProps) => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all",
            !isSidebarOpen && "p-0 h-5 w-5 mr-3 flex items-center justify-center"
          )}
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="hidden ml-3">Logout</span>}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="rounded-[2rem] border-none font-['IBM_Plex_Sans_Thai'] shadow-soft-double">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#2D3748]">ยืนยันการออกจากระบบ?</AlertDialogTitle>
          <AlertDialogDescription className="text-[#2D3748]/60">
            คุณต้องการออกจากระบบ TMR Portal ใช่หรือไม่?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
          variant={'default'} size={'default'} className="rounded-xl border-slate-200 hover:bg-slate-50">
            ยกเลิก
          </AlertDialogCancel>
          <AlertDialogAction
          variant={'default'} size={'default'}
            onClick={logout}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};