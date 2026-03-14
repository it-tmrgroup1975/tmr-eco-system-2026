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
  Wallet
} from "lucide-react";
import { cn } from "../../lib/utils";

export const MyPayslipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ["my-payslips", id],
    queryFn: () => payrollApi.getPayslipDetail(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#4A7C59] h-10 w-10" />
      </div>
    );
  }

  if (error || !payslip) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-charcoal">ไม่พบข้อมูลสลิป</h2>
        <p className="text-slate-500 text-sm mt-1">สลิปใบนี้อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-6">กลับไปหน้าหลัก</Button>
      </div>
    );
  }

  const deductionItems = [
    { label: "ภาษีหัก ณ ที่จ่าย", value: payslip.tax_deduction },
    { label: "ประกันสังคม (SSO)", value: payslip.social_security },
  ];
  
  const totalDeductions = deductionItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-in fade-in duration-500">
      {/* --- Mobile Top Bar --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <span className="font-bold text-charcoal text-base">ใบแจ้งเงินเดือน</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-[#4A7C59] hover:bg-[#4A7C59]/10"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
        {/* --- สรุปยอดเงินรวม (Hero Card) --- */}
        <div className="relative overflow-hidden bg-[#2D3748] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-charcoal/20">
            <div className="relative z-10">
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">เงินรวมสุทธิ (Net Pay)</p>
                <h2 className="text-4xl font-extrabold tracking-tight mb-4">
                    ฿{payslip.net_salary.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </h2>
                <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <FileText className="h-3 w-3 text-[#4A7C59]" />
                    <span className="text-[10px] font-medium uppercase">ประจำรอบเดือน {payslip.period_month}/{payslip.period_year}</span>
                </div>
            </div>
            {/* Background Decor */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#4A7C59]/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#4A7C59]/10 rounded-full blur-2xl"></div>
        </div>

        {/* --- รายละเอียดรายรับ (Earnings) --- */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#4A7C59]/10 p-2 rounded-2xl">
                    <TrendingUp className="h-5 w-5 text-[#4A7C59]" />
                </div>
                <h3 className="font-bold text-charcoal">รายรับ (Earnings)</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 font-medium">เงินเดือนพื้นฐาน / ค่าจ้าง</span>
                    <span className="text-sm font-bold text-charcoal">฿{payslip.salary_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-400 uppercase font-bold tracking-tighter mb-1">
                        <span>ชั่วโมงการทำงาน</span>
                        <span>อัตราต่อชั่วโมง</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#4A7C59]">
                        <span>{payslip.attendance_hours} ชม.</span>
                        <span>฿{payslip.hours_rate}</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* --- รายละเอียดรายจ่าย (Deductions) --- */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-50 p-2 rounded-2xl">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-bold text-charcoal">รายจ่าย / เงินหัก (Deductions)</h3>
            </div>
            <div className="space-y-4">
                {deductionItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                        <span className="text-sm font-bold text-red-500">- ฿{item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                ))}
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-sm font-bold text-charcoal">รวมเงินหักทั้งหมด</span>
                    <span className="text-sm font-extrabold text-red-600 underline decoration-red-200 decoration-4 underline-offset-4">
                        - ฿{totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* --- ข้อมูลพนักงาน (Footer Info) --- */}
        <div className="px-6 py-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">ข้อมูลพนักงาน</p>
            <p className="text-sm font-bold text-charcoal">{payslip.employee_name}</p>
        </div>

        {/* --- Floating Download Button --- */}
        <div className="hidden fixed bottom-6 left-0 right-0 px-6 flex justify-center">
            <Button className="w-full max-w-xs h-14 rounded-full bg-[#4A7C59] hover:bg-[#3D664A] shadow-xl shadow-[#4A7C59]/20 font-bold text-base transition-all active:scale-95">
                <Download className="mr-2 h-5 w-5" />
                ดาวน์โหลด PDF
            </Button>
        </div>
      </div>
    </div>
  );
};