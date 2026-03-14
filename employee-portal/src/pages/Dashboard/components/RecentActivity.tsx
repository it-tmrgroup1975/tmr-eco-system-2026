import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { attendanceApi } from '../../../api/attendanceApi';
import { cn } from '../../../lib/utils';

const RecentActivity = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['attendance-history'],
    queryFn: async () => {
      const response = await attendanceApi.getHistory();
      // ตรวจสอบว่า API ส่งข้อมูลมาที่ response.data ตรงๆ หรืออยู่ใน property อื่น เช่น response.data.results
      // ใช้ || [] เพื่อป้องกัน Error หากข้อมูลเป็น null หรือ undefined
      return response.data?.results || response.data || [];
    },
    initialData: [], // กำหนดค่าเริ่มต้นเป็น Array ว่างเพื่อป้องกัน .length พังในครั้งแรก
  });

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-300" /></div>;

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
                    {new Date(record.date).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
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