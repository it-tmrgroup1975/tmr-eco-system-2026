import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { payrollApi } from "../api/payrollApi";
import { toast } from "sonner";
import { Download, FileUp } from "lucide-react";
import { Label } from "./ui/label";

export function ImportPayrollDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", "3"); // ตัวอย่างเดือน
    formData.append("year", "2026");

    try {
      const res = await payrollApi.importPayroll(formData);
      toast.success(res.message);
      if (res.errors.length > 0) toast.error(`พบข้อผิดพลาด ${res.errors.length} จุด`);
    } catch (e) {
      toast.error("การนำเข้าล้มเหลว");
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
        <Button variant="outline"><FileUp className="mr-2 h-4 w-4" /> Import Excel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>นำเข้าข้อมูลเงินเดือน</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* เพิ่มส่วนดาวน์โหลด Template */}
          <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 mb-2">ยังไม่มีไฟล์ใช่หรือไม่? ดาวน์โหลดต้นแบบเพื่อกรอกข้อมูล</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-sage border-sage hover:bg-sage/10"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" /> ดาวน์โหลด Excel Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label>เลือกไฟล์ข้อมูล (.xlsx, .csv)</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".xlsx, .xls, .csv"
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-sage"
          >
            {loading ? "กำลังประมวลผล..." : "เริ่มต้นนำเข้าข้อมูล"}
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  );
}