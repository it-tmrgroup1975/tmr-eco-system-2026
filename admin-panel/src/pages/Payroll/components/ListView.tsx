import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Send, Clock } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Payslip } from "../../../types/payroll";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

interface ListViewProps {
  data: Payslip[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}


export const ListView = ({ data, selectedIds, onToggle }: ListViewProps) => {
  const navigate = useNavigate();

  return (
  <div className="grid gap-3">
    {data.map((ps) => (
      <Card key={ps.id} className={cn(
        "group transition-all border-none rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-md",
        selectedIds.includes(ps.id) && "ring-2 ring-[#4A7C59] bg-sage/5"
      )}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <input 
              type="checkbox" 
              checked={selectedIds.includes(ps.id)} 
              onChange={() => onToggle(ps.id)} 
              className="h-5 w-5 rounded-md border-slate-300 text-[#4A7C59] transition-all cursor-pointer" 
            />
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                {ps.employee_name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <Button variant={'ghost'} onClick={() => navigate(`/payroll/detail/${ps.id}`)} className="hover:cursor-pointer">
                <p className="font-bold text-[#2D3748] text-sm group-hover:text-[#4A7C59] transition-colors">{ps.employee_name}</p>
                </Button>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {ps.employee_department || 'General'}
                  </span>
                  <Badge className={cn(
                    "text-[9px] px-2 h-4 border-none font-black rounded-md", 
                    ps.cycle === '1H' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {ps.cycle === '1H' ? 'CYCLE 1' : 'CYCLE 2'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-[#2D3748] text-base">฿{Number(ps.net_salary).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] font-black uppercase">
              {ps.is_email_sent 
                ? <span className="text-emerald-500 flex items-center gap-1"><Send className="h-3 w-3" /> Sent Success</span> 
                : <span className="text-amber-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Ready</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);}