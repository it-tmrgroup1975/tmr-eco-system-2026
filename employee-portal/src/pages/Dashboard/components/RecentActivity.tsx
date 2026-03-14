import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { attendanceApi } from '../../../api/attendanceApi';
import { cn } from '../../../lib/utils';
import { parseISO, isValid, format } from 'date-fns';
import { th } from 'date-fns/locale';

const RecentActivity = () => {
  const { data: history, isLoading, isError, error } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      const response = await attendanceApi.getHistory();
      // แนะนำให้ log ดูโครงสร้างข้อมูลที่แท้จริง
      console.log('API Response:', response.data);
      return response.data?.results || response.data || [];
    },
    // ไม่ควรใส่ initialData: [] หากต้องการให้ isLoading แสดงผลเมื่อรีเฟรช
    retry: 1,
    staleTime: 5000, // ให้ข้อมูลสดใหม่เสมอ
  });

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin text-[#4A7C59]" />
    </div>
  );

  if (isError) return (
    <div className="text-center text-red-400 text-xs py-4">
      ไม่สามารถดึงข้อมูลได้ (Session อาจหมดอายุ)
    </div>
  );

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-bold text-[#2D3748] mb-4 text-sm">ประวัติการเข้างานล่าสุด</h3>
      <div className="space-y-4">
        {Array.isArray(history) && history.length > 0 ? (
          history.map((record: any) => (
            <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  record.status === 'normal' ? "bg-green-50 text-[#4A7C59]" : "bg-red-50 text-red-500"
                )}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D3748]">
                    {(() => {
                      // 1. แปลง string เป็น Date Object อย่างปลอดภัย
                      const date = record.date ? parseISO(record.date) : null;

                      // 2. ตรวจสอบว่าวันที่ใช้งานได้จริงหรือไม่ (ป้องกัน RangeError)
                      if (date && isValid(date)) {
                        return format(date, 'd MMMM yyyy', { locale: th });
                      }

                      return "วันที่ไม่ถูกต้อง"; // Fallback กรณีข้อมูลเสีย
                    })()}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={12} className="text-gray-400" />
                    {/* ใช้ span แทน p เพื่อป้องกัน nesting error */}
                    <span className="text-xs text-gray-400">
                      เข้า: {record.check_in} | {record.check_out ? `ออก: ${record.check_out}` : 'ยังไม่เช็คเอาท์'}
                    </span>
                  </div>
                </div>
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-md",
                record.status === 'normal' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              )}>
                {record.status === 'normal' ? 'ปกติ' : 'สาย'}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-xs py-4">ยังไม่มีประวัติการเข้างาน</p>
        )}
      </div>
    </section>
  );
};

export default RecentActivity;