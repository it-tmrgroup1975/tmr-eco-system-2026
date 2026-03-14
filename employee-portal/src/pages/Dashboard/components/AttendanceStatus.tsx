import { useState, useEffect } from 'react';
import { Clock, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

// Imports สำหรับ TanStack Query และ API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../../../api/attendanceApi';
import { toast } from 'sonner';

const AttendanceStatus = () => {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  // อัปเดตเวลาทุกนาทีเพื่อให้ UI ดู Real-time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 1. ดึงข้อมูลสถานะการเข้างานของวันนี้
  const { data: todayRecord, isLoading } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: async () => {
      const response = await attendanceApi.getTodayStatus();
      return response.data; // คาดหวัง Object ที่มี check_in และ check_out
    }
  });

  // 2. Mutation สำหรับการ Check-in (สี Sage Green)
  const checkInMutation = useMutation({
    mutationFn: (location: string) => attendanceApi.checkIn(location),
    onSuccess: () => {
      toast.success("ลงชื่อเข้างานสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "เกิดข้อผิดพลาดในการลงชื่อเข้า");
    }
  });

  // 3. Mutation สำหรับการ Check-out (สี Charcoal)
  const checkOutMutation = useMutation({
    mutationFn: () => attendanceApi.checkOut(),
    onSuccess: () => {
      toast.success("ลงชื่อออกงานสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-history'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "เกิดข้อผิดพลาดในการลงชื่อออก");
    }
  });

  // สรุปสถานะเพื่อใช้ใน Logic ของ UI
  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.check_out;
  const isPending = checkInMutation.isPending || checkOutMutation.isPending;
  
  const timeString = currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  // แสดง Loading ระหว่างดึงข้อมูลครั้งแรก
  if (isLoading) {
    return (
      <Card className="animate-pulse bg-white p-6 h-[280px] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={32} />
      </Card>
    );
  }

  const formatThaiTime = (timeStr: string | null | undefined) => {
    if (!timeStr) return "--:--";
    
    // กรณี API ส่งมาเฉพาะเวลา "HH:mm:ss" หรือ "HH:mm"
    if (timeStr.includes(':') && !timeStr.includes('T')) {
      return timeStr.substring(0, 5);
    }

    // กรณี API ส่งมาเป็น ISO String (DateTime)
    try {
      return new Date(timeStr).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok' // บังคับ Time Zone เป็นไทย
      });
    } catch (e) {
      return timeStr.substring(0, 5);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-soft bg-white">
      {/* แถบสีด้านบน: เขียวถ้าจบงานแล้ว/เข้างานแล้ว, ส้มถ้ายังไม่เข้างาน */}
      <div className={cn(
        "h-2 w-full transition-colors duration-500",
        isCheckedOut ? "bg-[#4A7C59]" : isCheckedIn ? "bg-[#2D3748]" : "bg-orange-400"
      )} />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-400 font-medium">สถานะการทำงานวันนี้</p>
            <h2 className="text-2xl font-bold mt-1 text-[#2D3748]">
              {isCheckedOut ? "จบการทำงานแล้ว" : isCheckedIn ? "กำลังปฏิบัติงาน" : "ยังไม่ได้เข้างาน"}
            </h2>
          </div>
          <div className="bg-[#F1F5F9] p-3 rounded-full">
            <Clock className={cn(
              "transition-colors", 
              isCheckedOut ? "text-[#4A7C59]" : isCheckedIn ? "text-[#2D3748]" : "text-orange-400"
            )} size={24} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400" />
            <span>สำนักงานใหญ่ (TMR Group)</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">เวลาปัจจุบัน</div>
              <div className="text-xl font-mono font-bold text-[#2D3748]">{timeString} น.</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">เข้า / ออก</div>
              <div className={cn("text-lg font-mono font-semibold", isCheckedIn ? "text-[#4A7C59]" : "text-slate-300")}>
                {formatThaiTime(todayRecord?.check_in)} / {formatThaiTime(todayRecord?.check_out)}
              </div>
            </div>
          </div>

          <Button
            disabled={isPending || isCheckedOut}
            onClick={() => !isCheckedIn ? checkInMutation.mutate("Office HQ") : checkOutMutation.mutate()}
            className={cn(
              "w-full h-12 text-base font-semibold transition-all duration-500 shadow-lg",
              // สถานะ 1: ยังไม่ได้เช็คอิน (สีเขียว Sage)
              !isCheckedIn && "bg-[#4A7C59] hover:bg-[#3d664a] text-white shadow-green-900/10",
              // สถานะ 2: เช็คอินแล้วแต่ยังไม่เช็คเอาท์ (สีเทา Charcoal)
              isCheckedIn && !isCheckedOut && "bg-[#2D3748] hover:bg-[#1a202c] text-white shadow-slate-900/10",
              // สถานะ 3: เช็คเอาท์เรียบร้อย (Disable)
              isCheckedOut && "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} /> กำลังบันทึก...
              </span>
            ) : isCheckedOut ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} /> บันทึกเวลาครบถ้วนแล้ว
              </span>
            ) : isCheckedIn ? (
              "ลงชื่อออกงาน (Check-out)"
            ) : (
              "ลงชื่อเข้างาน (Check-in)"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceStatus;