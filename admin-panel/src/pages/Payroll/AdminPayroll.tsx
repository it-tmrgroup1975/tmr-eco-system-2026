import { useState } from "react";
import { usePayroll } from "../../hooks/usePayroll";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Mail, Loader2, FileSpreadsheet } from "lucide-react"; // เพิ่ม FileSpreadsheet
import { ImportPayrollDialog } from "../../components/ImportDialog";

export const AdminPayroll = () => {
  const { payslips, isLoading, sendEmails, isSending } = usePayroll();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
          <p className="text-sm text-slate-500">จัดการข้อมูลและส่งเมลแจ้งสลิปเงินเดือนพนักงาน</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* เพิ่มปุ่ม Import ตรงนี้ */}
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
        {payslips && payslips.length > 0 ? (
          payslips.map((ps) => (
            <Card 
              key={ps.id} 
              className={`transition-all duration-300 border-none shadow-sm hover:shadow-md ${
                selectedIds.includes(ps.id) ? 'ring-2 ring-sage bg-sage/5' : 'bg-white'
              }`}
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
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 uppercase font-bold">
                      {ps.employee_name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">{ps.employee_name}</p>
                      <p className="text-xs text-slate-500">รอบเดือน: {ps.period_month}/{ps.period_year}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-sage text-lg">฿{ps.net_salary.toLocaleString()}</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      ps.is_email_sent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ps.is_email_sent ? 'ส่งแล้ว' : 'รอดำเนินการ'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
               <FileSpreadsheet className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">ยังไม่มีข้อมูลสลิปเงินเดือนในระบบ</p>
            <p className="text-sm text-slate-400 mb-6">เริ่มโดยการนำเข้าไฟล์ Excel จากปุ่มด้านบน</p>
            <ImportPayrollDialog />
          </div>
        )}
      </div>
    </div>
  );
};