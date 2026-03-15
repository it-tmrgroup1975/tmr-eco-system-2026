import { useState, useMemo } from "react";
import { usePayroll } from "../../hooks/usePayroll";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Mail, Loader2, FileSpreadsheet, Filter } from "lucide-react";
import { ImportPayrollDialog } from "../../components/ImportDialog";
import { Badge } from "../../components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { cn } from "../../lib/utils";
import type { PaymentCycle } from "../../types/payroll";

export const AdminPayroll = () => {
  const { payslips, isLoading, sendEmails, isSending } = usePayroll();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // 1. เพิ่ม State สำหรับจัดการการเลือกงวดการจ่ายในหน้า UI
  const [viewCycle, setViewCycle] = useState<PaymentCycle | "ALL">("ALL");

  // 2. ลอจิกการกรองข้อมูลที่แสดงผลตามงวดที่เลือก
  const filteredPayslips = useMemo(() => {
    if (!payslips) return [];
    if (viewCycle === "ALL") return payslips;
    return payslips.filter(ps => ps.cycle === viewCycle);
  }, [payslips, viewCycle]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkSend = () => {
    if (selectedIds.length === 0) return;
    sendEmails({ ids: selectedIds });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3748]">จัดการส่งใบแจ้งเงินเดือน</h1>
          <p className="text-sm text-slate-500">ระบบเงินเดือนออก 2 ครั้งต่อเดือน (Bi-monthly Payroll System)</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 3. Dropdown สำหรับกรองงวดการจ่าย (ตามที่คุณต้องการ) */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select 
              value={viewCycle} 
              onValueChange={(value) => setViewCycle(value as PaymentCycle | "ALL")}
            >
              <SelectTrigger className="w-[160px] border-none shadow-none focus:ring-0 h-8">
                <SelectValue placeholder="งวดการจ่ายทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">งวดการจ่ายทั้งหมด</SelectItem>
                <SelectItem value="1H">งวดที่ 1 (ต้นเดือน)</SelectItem>
                <SelectItem value="2H">งวดที่ 2 (สิ้นเดือน)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ImportPayrollDialog />

          <Button 
            className="bg-[#4A7C59] hover:bg-[#3d664a] text-white shadow-soft transition-all"
            disabled={selectedIds.length === 0 || isSending}
            onClick={handleBulkSend}
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            ส่งอีเมล ({selectedIds.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPayslips.length > 0 ? (
          filteredPayslips.map((ps) => (
            <Card 
              key={ps.id} 
              className={cn(
                "transition-all duration-300 border-none shadow-sm hover:shadow-md",
                selectedIds.includes(ps.id) ? 'ring-2 ring-sage bg-sage/5' : 'bg-white'
              )}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ps.id)}
                    onChange={() => toggleSelect(ps.id)}
                    className="h-5 w-5 rounded border-gray-300 text-sage focus:ring-sage cursor-pointer"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 uppercase font-bold text-sm">
                      {ps.employee_name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">{ps.employee_name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500">{ps.period_month}/{ps.period_year}</p>
                        {/* แสดง Badge ระบุงวดการจ่ายให้ชัดเจน */}
                        <Badge className={cn(
                          "text-[10px] px-2 py-0 h-4 border-none font-medium",
                          ps.cycle === '1H' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {ps.cycle === '1H' ? 'งวดที่ 1' : 'งวดที่ 2'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-sage text-lg">฿{ps.net_salary.toLocaleString()}</p>
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                      ps.is_email_sent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {ps.is_email_sent ? 'ส่งแล้ว' : 'รอดำเนินการ'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-dashed border-slate-300">
            <FileSpreadsheet className="h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">ไม่พบข้อมูลใบแจ้งเงินเดือนในงวดที่เลือก</p>
            <p className="text-sm text-slate-400 mt-1">คุณสามารถเปลี่ยนตัวกรอง หรือนำเข้าข้อมูลใหม่ได้</p>
          </div>
        )}
      </div>
    </div>
  );
};