import { useNavigate } from "react-router-dom";
import { useMyPayroll } from "../../hooks/useMyPayroll"; // Hook ที่เราสร้างไว้ก่อนหน้า
import { Card, CardContent } from "../../components/ui/card";
import { 
  ChevronRight, 
  Loader2, 
  Calendar,
  SearchX
} from "lucide-react";
import { cn } from "../../lib/utils";

export const MyPayslipList = () => {
  const navigate = useNavigate();
  const { data: payslips, isLoading } = useMyPayroll();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#4A7C59] h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header ส่วนหัว */}
      <div className="p-6 bg-white border-b border-slate-100">
        <h1 className="text-2xl font-bold text-[#2D3748]">ประวัติเงินเดือน</h1>
        <p className="text-sm text-slate-500 mt-1">รายการใบแจ้งเงินเดือนทั้งหมดของคุณ</p>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-3">
        {payslips && payslips.length > 0 ? (
          payslips.map((ps) => (
            <Card 
              key={ps.id}
              className="border-none shadow-sm rounded-3xl overflow-hidden active:scale-95 transition-all cursor-pointer bg-white hover:bg-slate-50"
              onClick={() => navigate(`/dashboard/payslips/${ps.id}`)}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#4A7C59]/10 p-3 rounded-2xl">
                    <Calendar className="h-6 w-6 text-[#4A7C59]" />
                  </div>
                  <div>
                    <p className="font-bold text-charcoal text-lg">
                      {ps.period_month}/{ps.period_year}
                    </p>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      ยอดสุทธิ: ฿{ps.net_salary.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    ps.is_email_sent ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {ps.is_email_sent ? "Sent" : "Pending"}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
                <SearchX className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-500">ไม่พบข้อมูลสลิป</h3>
            <p className="text-sm text-slate-400">คุณยังไม่มีรายการเงินเดือนในระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
};