import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, Loader2, ChevronRight } from "lucide-react";
import { useMyPayroll } from "../../../hooks/useMyPayroll";
import { useNavigate } from "react-router-dom";

export const PayslipWidget = () => {
  const { data: payslips, isLoading, error } = useMyPayroll();
  const navigate = useNavigate();
  
  // ป้องกัน Error หากข้อมูลยังมาไม่ถึง
  const latestPayslip = payslips && payslips.length > 0 ? payslips[0] : null;

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 border-none shadow-soft bg-white/50 backdrop-blur-xl">
        <Loader2 className="animate-spin text-sage h-6 w-6" />
      </Card>
    );
  }

  // กรณีเกิด Error ในการดึงข้อมูล
  if (error) {
    return (
      <Card className="p-6 border-none shadow-soft bg-white/50 backdrop-blur-xl">
        <p className="text-xs text-red-400 text-center">ไม่สามารถดึงข้อมูลได้</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-soft bg-white/50 backdrop-blur-xl hover:bg-white/60 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">เงินเดือนล่าสุด</CardTitle>
        <div className="bg-sage/10 p-1.5 rounded-full">
          <FileText className="h-4 w-4 text-sage" />
        </div>
      </CardHeader>
      <CardContent>
        {latestPayslip ? (
          <>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-bold text-charcoal">
                ฿{latestPayslip.net_salary.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
              รอบเดือน {latestPayslip.period_month}/{latestPayslip.period_year}
            </p>
            <div className="mt-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs border-sage/30 text-sage hover:bg-sage hover:text-white transition-all group"
                onClick={() => navigate(`/dashboard/payslips/${latestPayslip.id}`)}
              >
                ดูรายละเอียด
                <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
             <p className="text-sm text-slate-400">ยังไม่มีข้อมูลเงินเดือน</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};