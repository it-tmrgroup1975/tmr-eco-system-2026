import { useState } from "react";
import { usePayroll } from "../../hooks/usePayroll";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Mail, Loader2 } from "lucide-react";

export default function PayrollPage() {
  const { payslips, isLoading, sendEmails, isSending } = usePayroll();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSend = () => {
    if (selectedIds.length > 0) {
      sendEmails({ ids: selectedIds });
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-charcoal">ระบบจัดการเงินเดือน</h1>
        <Button 
          onClick={handleSend} 
          disabled={selectedIds.length === 0 || isSending}
          className="bg-sage hover:bg-sage/90 transition-all shadow-soft"
        >
          {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          ส่งอีเมลรายบุคคล ({selectedIds.length})
        </Button>
      </div>

      <div className="grid gap-4">
        {payslips?.map((ps) => (
          <Card key={ps.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-charcoal">{ps.employee_name}</p>
                <p className="text-sm text-slate-500">รอบเดือน: {ps.period_month}/{ps.period_year}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sage">{ps.net_salary.toLocaleString()} THB</p>
                <span className={`text-xs px-2 py-1 rounded-full ${ps.is_email_sent ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {ps.is_email_sent ? 'ส่งแล้ว' : 'รอดำเนินการ'}
                </span>
              </div>
              {/* ตัวอย่าง Checkbox เลือกรายการ */}
              <input 
                type="checkbox" 
                onChange={(e) => {
                  if (e.target.checked) setSelectedIds([...selectedIds, ps.id]);
                  else setSelectedIds(selectedIds.filter(id => id !== ps.id));
                }}
                className="ml-4 h-5 w-5 accent-sage"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}