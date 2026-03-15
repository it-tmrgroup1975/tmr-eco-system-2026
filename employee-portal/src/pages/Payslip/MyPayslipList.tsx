import { useNavigate } from "react-router-dom";
import { useMyPayroll } from "../../hooks/useMyPayroll";
import { Card, CardContent } from "../../components/ui/card";
import { 
  ChevronRight, 
  Loader2, 
  Wallet,
  CalendarDays,
  SearchX,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { PaymentCycle } from "../../types/payroll";
import { Badge } from "../../components/ui/badge";

const CycleBadge = ({ cycle }: { cycle: PaymentCycle }) => (
  <Badge className={cn(
    "backdrop-blur-xl border-none",
    cycle === '1H' ? "bg-sage-200 text-sage-800" : "bg-blue-100 text-blue-800"
  )}>
    {cycle === '1H' ? 'งวดที่ 1' : 'งวดที่ 2'}
  </Badge>
);

export const MyPayslipList = () => {
  const navigate = useNavigate();
  const { data: payslips, isLoading } = useMyPayroll();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <Loader2 className="animate-spin text-[#4A7C59] h-12 w-12" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-[#4A7C59] animate-ping opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-['IBM_Plex_Sans_Thai']">
      {/* --- Background Decorative Elements --- */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#4A7C59]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-72 h-72 bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- Sticky Glass Header --- */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 px-6 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              ประวัติเงินเดือน <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
              <span className="h-1 w-3 bg-[#4A7C59] rounded-full"></span>
              My Earnings History
            </p>
          </div>
          <div className="h-10 w-10 bg-[#4A7C59]/10 rounded-2xl flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-[#4A7C59]" />
          </div>
        </div>
      </div>

      <div className="p-5 max-w-md mx-auto space-y-5 pt-6 pb-32 relative z-10">
        {payslips && payslips.length > 0 ? (
          payslips.map((ps, index) => (
            <Card 
              key={ps.id}
              className={cn(
                "group border-none rounded-[2.5rem] p-[2px] transition-all duration-500",
                "bg-gradient-to-br from-white via-white to-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]",
                "hover:shadow-[0_20px_40px_-10px_rgba(74,124,89,0.15)] hover:translate-y-[-4px]",
                "active:scale-95 cursor-pointer animate-in slide-in-from-bottom-6"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => navigate(`/dashboard/payslips/${ps.id}`)}
            >
              <CardContent className="p-5 bg-white rounded-[2.4rem] flex items-center justify-between relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4A7C59]/5 rounded-bl-[100px] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="bg-gradient-to-tr from-[#4A7C59] to-[#6BA37A] p-4 rounded-[1.5rem] shadow-lg shadow-[#4A7C59]/20 transform group-hover:rotate-6 transition-transform">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-700 text-xl tracking-tight">
                      {ps.period_month}/{ps.period_year}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-slate-400">Net Pay:</span>
                      <span className="text-base font-black text-[#4A7C59]">
                        ฿{ps.net_salary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 relative z-10">
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    ps.is_email_sent 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-orange-50 text-orange-600 border border-orange-100"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      ps.is_email_sent ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-orange-500"
                    )}></span>
                    {ps.is_email_sent ? "Confirmed" : "Process"}
                  </div>
                  <div className="bg-slate-50 group-hover:bg-[#4A7C59] p-1.5 rounded-xl transition-colors">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in duration-700">
            <div className="relative mb-8">
              <div className="h-24 w-24 bg-white rounded-[2rem] shadow-soft flex items-center justify-center relative z-10">
                <SearchX className="h-10 w-10 text-slate-200" />
              </div>
              <div className="absolute -inset-4 bg-[#4A7C59]/5 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="font-black text-slate-800 text-xl">ไม่พบข้อมูลสลิปเงินเดือน</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-[220px] mx-auto leading-relaxed">
              เมื่อบริษัททำการสรุปยอดเงินเดือน ข้อมูลของคุณจะมาแสดงที่นี่ทันที
            </p>
          </div>
        )}
      </div>

      {/* --- Floating Bottom Blur Decor --- */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};