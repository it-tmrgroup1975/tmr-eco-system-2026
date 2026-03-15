import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { payrollApi } from "../../api/payrollApi";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";

export const MyPayslipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ["my-payslips", id],
    queryFn: () => payrollApi.getPayslipDetail(Number(id)),
    enabled: !!id,
  });

  // ฟังก์ชันแสดงชื่อเดือนไทย
  const getThaiMonth = (month: number) => {
    return new Date(0, month - 1).toLocaleString('th-TH', { month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#4A7C59] h-12 w-12" />
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-charcoal">ไม่พบข้อมูลสลิป</h2>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-6 rounded-full px-8">
          กลับไปหน้าหลัก
        </Button>
      </div>
    );
  }

  // --- ลอจิกการจัดการรายการเงินหัก (Deductions Logic) ---
  const deductionItems = [];
  
  // ภาษีหัก ณ ที่จ่าย (ถ้ามี)
  if (Number(payslip.tax_deduction) > 0) {
    deductionItems.push({ label: "ภาษีหัก ณ ที่จ่าย", value: Number(payslip.tax_deduction) });
  }

  // ประกันสังคม (SSO): แสดงเฉพาะกรณีที่มีค่ามากกว่า 0 (ซึ่งปกติคือรอบ 2H)
  if (Number(payslip.social_security) > 0) {
    deductionItems.push({ label: "ประกันสังคม (SSO)", value: Number(payslip.social_security) });
  }
  
  const totalDeductions = deductionItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['IBM_Plex_Sans_Thai']">
      {/* --- Mobile Top Bar --- */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <span className="font-black text-charcoal text-base">สลิปเงินเดือนแบบละเอียด</span>
        <Button variant="ghost" size="icon" className="rounded-full text-[#4A7C59]">
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-5 space-y-5 max-w-md mx-auto pb-32 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* --- สรุปยอดเงินรวม (Hero Card) --- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2D3748] to-[#1A202C] rounded-[3rem] p-8 text-white shadow-2xl shadow-charcoal/30">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">Net Pay Amount</p>
                    <h2 className="text-4xl font-black tracking-tight mt-1">
                        ฿{Number(payslip.net_salary).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </h2>
                  </div>
                  <Sparkles className="h-6 w-6 text-amber-400 fill-amber-400 opacity-50" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/10 hover:bg-white/10 border-none backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full">
                    {getThaiMonth(payslip.period_month)} {payslip.period_year}
                  </Badge>
                  <Badge className={cn(
                    "border-none backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full",
                    payslip.cycle === '1H' ? "bg-sage-400/20 text-sage-300" : "bg-blue-400/20 text-blue-300"
                  )}>
                    {payslip.cycle === '1H' ? 'งวดที่ 1 (ต้นเดือน)' : 'งวดที่ 2 (สิ้นเดือน)'}
                  </Badge>
                </div>
            </div>
            {/* Background Decor */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#4A7C59]/20 rounded-full blur-3xl"></div>
        </div>

        {/* --- คำแนะนำเรื่องประกันสังคม (Bi-monthly Info) --- */}
        {payslip.cycle === '1H' && (
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-3xl flex gap-3 items-start">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              หมายเหตุ: เงินเดือนรอบต้นเดือนจะยังไม่มีการหักประกันสังคม (SSO) โดยยอดหักจะถูกนำไปคำนวณรวบยอดครั้งเดียวในสลิปสิ้นเดือน
            </p>
          </div>
        )}

        {/* --- รายละเอียดรายรับ (Earnings) --- */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-sage-50 p-2.5 rounded-2xl">
                    <TrendingUp className="h-5 w-5 text-[#4A7C59]" />
                </div>
                <h3 className="font-black text-charcoal text-sm">รายรับ (Earnings)</h3>
            </div>
            <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-bold">ค่าจ้างตามเวลาปฏิบัติงาน</span>
                    <span className="text-sm font-black text-charcoal tracking-tight">
                      ฿{Number(payslip.salary_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                </div>
                <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100/50">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">
                        <span>Attendance</span>
                        <span>Rate / Hr</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-[#4A7C59]">
                        <span>{payslip.attendance_hours} <span className="text-[10px] text-slate-400 ml-1">HRS</span></span>
                        <span>฿{payslip.hours_rate}</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* --- รายละเอียดรายจ่าย (Deductions) --- */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-50 p-2.5 rounded-2xl">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-black text-charcoal text-sm">รายจ่าย / เงินหัก (Deductions)</h3>
            </div>
            <div className="space-y-4">
                {deductionItems.length > 0 ? (
                  deductionItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 font-bold">{item.label}</span>
                        <span className="text-sm font-black text-red-500">- ฿{item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">ไม่มีรายการเงินหักในรอบนี้</p>
                )}
                
                {totalDeductions > 0 && (
                  <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-charcoal uppercase">Total Deductions</span>
                      <span className="text-base font-black text-red-600">
                          - ฿{totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* --- ข้อมูลพนักงาน (Footer Info) --- */}
        <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Employee Signature Info</p>
            <p className="text-sm font-black text-charcoal">{payslip.employee_name}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* --- Floating Action Button --- */}
        <div className="hidden fixed bottom-8 left-0 right-0 px-8 flex justify-center z-50">
            <Button className="w-full max-w-xs h-14 rounded-full bg-[#4A7C59] hover:bg-[#3D664A] shadow-2xl shadow-[#4A7C59]/30 font-black text-sm uppercase tracking-widest transition-all active:scale-95 group">
                <Download className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Download Payslip PDF
            </Button>
        </div>
      </div>
    </div>
  );
};