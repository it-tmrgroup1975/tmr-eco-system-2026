// src/pages/Dashboard/components/PayslipWidget.tsx
import { Receipt, Download, Eye, TrendingUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export function PayslipWidget() {
  return (
    <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-soft-double overflow-hidden h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-sage/10 text-sage">
            <Receipt size={24} />
          </div>
          <div className="text-right">
            <p className="text-xs text-charcoal/40 font-medium uppercase tracking-wider">งวดปัจจุบัน</p>
            <p className="text-sm font-bold text-charcoal">มีนาคม 2569</p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="bg-[#F1F5F9]/50 p-4 rounded-2xl border border-white/40">
            <p className="text-xs text-charcoal/60 mb-1 flex items-center gap-1">
              รายรับสุทธิ <TrendingUp size={12} className="text-sage" />
            </p>
            <div className="text-3xl font-black text-charcoal">
              <span className="text-sage text-xl mr-1">฿</span>45,000.00
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/40 border border-white/20">
              <p className="text-[10px] text-charcoal/40">รายได้รวม</p>
              <p className="text-sm font-bold text-charcoal">52,400</p>
            </div>
            <div className="p-3 rounded-xl bg-white/40 border border-white/20">
              <p className="text-[10px] text-charcoal/40">รายการหัก</p>
              <p className="text-sm font-bold text-red-500">-7,400</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-xl border-charcoal/10 text-charcoal hover:bg-white">
            <Eye size={16} className="mr-2" /> รายละเอียด
          </Button>
          <Button className="bg-sage hover:bg-sage-hover text-white rounded-xl shadow-lg shadow-sage/20">
            <Download size={16} className="mr-2" /> ดาวน์โหลด
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}