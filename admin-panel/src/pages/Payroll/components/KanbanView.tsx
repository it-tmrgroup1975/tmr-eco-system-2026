import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";
import type { Payslip } from "../../../types/payroll";
import { useNavigate } from "react-router-dom";


interface KanbanViewProps {
  data: Payslip[];
  onSend: (id: number) => void;
  isSending: boolean;
}

export const KanbanView = ({ data, onSend, isSending }: KanbanViewProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((ps) => (
        <Card key={ps.id} className="group border-none rounded-[2rem] shadow-soft hover:shadow-lg transition-all duration-500 bg-white/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black">
                  {ps.employee_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <Button variant={'ghost'} onClick={() => navigate(`/payroll/detail/${ps.id}`)} className="hover:cursor-pointer">
                    <h3 className="font-black text-[#2D3748] text-base leading-none mb-1">{ps.employee_name}</h3>
                  </Button>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {ps.employee_department || 'General'}
                  </span>
                </div>
              </div>
              <Badge className={cn(
                "border-none px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter",
                ps.cycle === '1H' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
              )}>
                {ps.cycle === '1H' ? 'Cycle 1' : 'Cycle 2'}
              </Badge>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50 mb-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Net Income</p>
              <p className="text-2xl font-black text-[#4A7C59] tracking-tight text-center">
                ฿{Number(ps.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[9px] font-black uppercase flex items-center gap-1.5",
                ps.is_email_sent ? "text-emerald-500" : "text-amber-500"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", ps.is_email_sent ? "bg-emerald-500" : "bg-amber-500")} />
                {ps.is_email_sent ? 'Email Sent' : 'Ready'}
              </span>
              <Button
                size="sm"
                onClick={() => onSend(ps.id)}
                disabled={isSending}
                className={cn(
                  "rounded-2xl h-9 px-5 font-black text-[9px] uppercase tracking-widest transition-all",
                  ps.is_email_sent ? "bg-slate-100 text-slate-400" : "bg-[#2D3748] text-white hover:bg-slate-800"
                )}
              >
                {ps.is_email_sent ? 'Resend' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}