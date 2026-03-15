import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { payrollApi } from "../../api/payrollApi";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
    ArrowLeft, Download, Loader2, FileText, TrendingUp,
    TrendingDown, Building2, User, CalendarDays, Sparkles,
    Info, MailCheck, History, Wallet, Briefcase,
    AlertCircle
} from "lucide-react";
import { Badge } from "../../components/ui/badge";

export const PaySlipDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: payslip, isLoading, error } = useQuery({
        queryKey: ["payslips", id],
        queryFn: () => payrollApi.getPayslipDetail(Number(id)),
        enabled: !!id,
    });

    const getThaiMonth = (month: number) => {
        return new Date(0, month - 1).toLocaleString('th-TH', { month: 'long' });
    };

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-sage h-12 w-12" />
                <p className="text-sm font-bold text-slate-400 animate-pulse">GENERATING REPORT...</p>
            </div>
        </div>
    );

    if (error || !payslip) return (
        <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-charcoal">Data Retrieval Failed</h2>
            <p className="text-slate-500 mt-2">สลิปใบนี้อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึงข้อมูล</p>
            <Button onClick={() => navigate(-1)} className="mt-8 rounded-xl px-10 bg-charcoal">Back to Dashboard</Button>
        </div>
    );

    const deductionItems = [
        { label: "ภาษีหัก ณ ที่จ่าย (Withholding Tax)", value: Number(payslip.tax_deduction) },
        { label: "ประกันสังคม (SSO)", value: Number(payslip.social_security) },
    ].filter(item => item.value > 0);

    const totalDeductions = deductionItems.reduce((sum, item) => sum + item.value, 0);

    // ลอจิกการกดย้อนกลับอัจฉริยะ
    const handleBack = () => {
        // ตรวจสอบว่ามีประวัติการเข้าชมหรือไม่ ถ้าไม่มีให้กลับไปที่ root payroll
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/dashboard/payroll");
        }
    };

    const handleDownloadPDF = async () => {
        if (!payslip) return;
        const filename = `Payslip_${payslip.employee_name}_${payslip.period_month}_${payslip.period_year}.pdf`;

        try {
            // เรียกใช้ API ที่เราสร้างไว้ (อย่าลืมเพิ่มใน payrollApi.ts ด้วย)
            await payrollApi.downloadPayslipPDF(payslip.id, filename);
        } catch (error) {
            console.error("Download failed", error);
            // คุณอาจจะเพิ่ม toast.error("ดาวน์โหลดล้มเหลว") ตรงนี้
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-['IBM_Plex_Sans_Thai']">
            {/* --- Desktop Elegant Top Bar --- */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Button variant="outline" size="sm" onClick={handleBack} className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        ย้อนกลับ
                    </Button>
                    <div className="h-8 w-[1px] bg-slate-200" />
                    <div>
                        <h1 className="text-lg font-black text-charcoal leading-none">รายงานใบแจ้งเงินเดือนแบบละเอียด</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Payroll Document ID: #{payslip.id.toString().padStart(6, '0')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 gap-2 font-bold text-xs h-10">
                        <MailCheck className="h-4 w-4 text-sage" />
                        {payslip.is_email_sent ? "อีเมลส่งสำเร็จแล้ว" : "ยังไม่ได้ส่งอีเมล"}
                    </Button>
                    <Button
                        onClick={handleDownloadPDF} // เพิ่ม onClick
                        className="rounded-xl bg-sage hover:bg-sage-700 shadow-lg shadow-sage/20 gap-2 font-bold text-xs h-10 px-6"
                    >
                        <Download className="h-4 w-4" />
                        ดาวน์โหลดเอกสาร (PDF)
                    </Button>
                </div>
            </div>

            <div className="p-8 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-12 gap-6">

                    {/* --- LEFT COLUMN: Employee & Status (3/12) --- */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                            <CardHeader className="pb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</p>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-col items-center text-center py-4">
                                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-4">
                                        <User className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-charcoal">{payslip.employee_name}</h3>
                                    <p className="text-sm font-bold text-sage mb-4">พนักงานประจำ</p>

                                    <div className="w-full space-y-3 pt-4 border-t border-slate-50 text-left">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Building2 className="h-4 w-4" />
                                            <span className="text-xs font-bold">{payslip.employee_department || 'ไม่ระบุแผนก'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <Briefcase className="h-4 w-4" />
                                            <span className="text-xs font-bold">รหัส: EMP-{payslip.employee.toString().padStart(4, '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <History className="h-4 w-4 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payroll Timeline</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-sage mt-1.5 shadow-[0_0_8px_rgba(74,124,89,0.5)]" />
                                    <div>
                                        <p className="text-xs font-black text-charcoal leading-none">ประจำเดือน</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{getThaiMonth(payslip.period_month)} {payslip.period_year}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                    <div>
                                        <p className="text-xs font-black text-charcoal leading-none">รอบการจ่าย</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{payslip.cycle === '1H' ? 'งวดที่ 1 (ต้นเดือน)' : 'งวดที่ 2 (สิ้นเดือน)'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* --- MIDDLE COLUMN: Earnings & Deductions (6/12) --- */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-sage/10 p-3 rounded-2xl text-sage">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="font-black text-charcoal">รายรับ (Earnings)</CardTitle>
                                </div>
                                <Badge variant="outline" className="border-sage/20 text-sage bg-sage/5">รายการปกติ</Badge>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                                    <span className="text-sm text-slate-500 font-bold">เงินเดือนพื้นฐาน (Base Salary)</span>
                                    <span className="text-lg font-black text-charcoal">฿{Number(payslip.salary_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-8 flex items-center justify-between border border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculation Method</p>
                                        <p className="text-sm font-bold text-slate-600 italic">คำนวณตามเวลาปฏิบัติงานจริง (Time-based)</p>
                                    </div>
                                    <div className="flex items-center gap-8 text-right">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                                            <p className="text-xl font-black text-sage">{payslip.attendance_hours} <span className="text-[10px] opacity-50 ml-1">HRS</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate / Hr</p>
                                            <p className="text-xl font-black text-sage">฿{payslip.hours_rate}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="bg-red-50/20 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 p-3 rounded-2xl text-red-500">
                                        <TrendingDown className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="font-black text-charcoal">รายจ่าย (Deductions)</CardTitle>
                                </div>
                                <Badge variant="outline" className="border-red-200 text-red-500">รายการหักบังคับ</Badge>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {deductionItems.length > 0 ? (
                                    deductionItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2">
                                            <span className="text-sm text-slate-500 font-bold">{item.label}</span>
                                            <span className="text-sm font-black text-red-500 tracking-tight">- ฿{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                        <Info className="h-10 w-10 mb-2" />
                                        <p className="text-xs font-bold">ไม่พบรายการเงินหักในงวดนี้</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: Summary & Total (3/12) --- */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#89b4ff] to-[#aabce0] rounded-[3rem] p-10 text-white shadow-2xl shadow-charcoal/40">
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Net Income Summary</p>
                                    <Sparkles className="h-6 w-6 text-amber-400 fill-amber-400" />
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-[40px] font-black tracking-tighter">
                                        ฿{Number(payslip.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </h2>
                                    <p className="text-xs font-bold text-sage opacity-80 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <Wallet className="h-4 w-4" />
                                        ยอดโอนเข้าบัญชี
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-white/10 space-y-4">
                                    <div className="flex justify-between items-center text-white/50">
                                        <span className="text-[10px] font-black uppercase">Gross Salary</span>
                                        <span className="text-sm font-bold">฿{Number(payslip.salary_amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-red-400">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Total Deductions</span>
                                        <span className="text-sm font-black">- ฿{totalDeductions.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sage/20 rounded-full blur-[80px]" />
                        </div>

                        <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="h-4 w-4 text-blue-500" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HR Notification</p>
                            </div>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                เอกสารนี้เป็นใบแจ้งเงินเดือนอิเล็กทรอนิกส์ หากพบความผิดปกติในจำนวนเงิน โปรดติดต่อแผนกบุคคลภายใน 3 วันทำการ
                            </p>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};