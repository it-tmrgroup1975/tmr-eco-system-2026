import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { payrollApi } from "../api/payrollApi";
import { toast } from "sonner";
import { Download, FileUp, CalendarDays } from "lucide-react";
import type { PaymentCycle } from "../types/payroll";

export function ImportPayrollDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // สถานะสำหรับเลือกช่วงเวลาและงวดการจ่าย
  const [month, setMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [cycle, setCycle] = useState<PaymentCycle>("1H");

  const handleUpload = async () => {
    if (!file || !month || !year || !cycle) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("cycle", cycle);

    try {
      // เรียก API ที่เราปรับปรุงให้รับ Cycle
      const res = await payrollApi.importPayroll(formData);
      toast.success(res.message);
      if (res.errors && res.errors.length > 0) {
        toast.error(`พบข้อผิดพลาดในไฟล์ ${res.errors.length} จุด`);
      }
    } catch (e: any) {
      const errorMsg = e.response?.data?.error || "การนำเข้าล้มเหลว";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await payrollApi.downloadTemplate();
      toast.success("ดาวน์โหลด Template สำเร็จ");
    } catch (error) {
      toast.error("ไม่สามารถดาวน์โหลด Template ได้");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-sage text-sage hover:bg-sage/10">
          <FileUp className="mr-2 h-4 w-4" /> Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-white/90">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-sage" />
            นำเข้าข้อมูลเงินเดือน (Bi-monthly)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ส่วนดาวน์โหลด Template */}
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 mb-3">กรุณาใช้ไฟล์ตามรูปแบบมาตรฐานเพื่อป้องกันข้อผิดพลาด</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-sage border-sage hover:bg-sage/5"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด Excel Template
            </Button>
          </div>

          {/* ฟอร์มเลือก เดือน/ปี และ งวดการจ่าย */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">เดือน</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString('th-TH', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">ปี (ค.ศ.)</Label>
              <Input 
                id="year" 
                type="number" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>งวดการจ่ายเงิน (Payment Cycle)</Label>
            <Select value={cycle} onValueChange={(value: PaymentCycle) => setCycle(value)}>
              <SelectTrigger className="w-full border-sage/30 focus:ring-sage">
                <SelectValue placeholder="เลือกงวดการจ่าย" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1H">งวดที่ 1 (วันที่ 1-15)</SelectItem>
                <SelectItem value="2H">งวดที่ 2 (วันที่ 16-สิ้นเดือน)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-slate-400">** งวดที่ 2 จะมีการคำนวณหักประกันสังคมรวบยอดทั้งเดือน</p>
          </div>

          <div className="space-y-2">
            <Label>ไฟล์ข้อมูลพนักงาน</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".xlsx, .xls, .csv"
              className="cursor-pointer file:text-sage"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-sage hover:bg-sage/90 shadow-md transition-all"
          >
            {loading ? "กำลังประมวลผล..." : "เริ่มต้นนำเข้าข้อมูล"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}