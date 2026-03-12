import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Save, Loader2, Briefcase, MapPin, UserCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function EmployeeForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ดึงข้อมูลแผนกและตำแหน่งจาก API
  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn: () => api.get("/api/departments/").then(res => res.data) });
  const { data: positions } = useQuery({ queryKey: ["positions"], queryFn: () => api.get("/api/positions/").then(res => res.data) });

  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employment_type: "Full-time",
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post("/api/employees/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("บันทึกข้อมูลบุคลากรเรียบร้อยแล้ว");
      onSuccess();
    },
    onError: () => toast.error("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (fileInputRef.current?.files?.[0]) {
      data.append("avatar", fileInputRef.current.files[0]);
    }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ส่วนอัปโหลดรูปภาพ */}
      <div className="flex flex-col items-center">
        <div 
          className="group relative w-32 h-32 rounded-[2.5rem] bg-[#F1F5F9] border-4 border-white shadow-soft-double overflow-hidden cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#4A7C59]/40 group-hover:text-[#4A7C59] transition-colors">
              <Camera size={32} />
              <span className="text-[10px] font-bold mt-1">UPLOAD</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#4A7C59] uppercase tracking-widest flex items-center gap-2">
            <UserCircle size={16} /> ข้อมูลพื้นฐาน
          </h3>
          <div className="space-y-2">
            <Label className="text-[#2D3748]/60">รหัสพนักงาน</Label>
            <Input required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} className="rounded-xl border-[#2D3748]/10 h-11" placeholder="เช่น TMR001" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#2D3748]/60">ชื่อจริง</Label>
              <Input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="rounded-xl border-[#2D3748]/10 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2D3748]/60">นามสกุล</Label>
              <Input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="rounded-xl border-[#2D3748]/10 h-11" />
            </div>
          </div>
        </div>

        {/* ข้อมูลการทำงานพร้อม Select */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#4A7C59] uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={16} /> รายละเอียดงาน
          </h3>
          <div className="space-y-2">
            <Label className="text-[#2D3748]/60 flex items-center gap-1">
              <MapPin size={14} /> แผนก
            </Label>
            <select 
              required
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              className="w-full h-11 rounded-xl border border-[#2D3748]/10 bg-white/50 px-3 text-sm focus:ring-2 focus:ring-[#4A7C59]/20 outline-none appearance-none"
            >
              <option value="">เลือกแผนก...</option>
              {departments?.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-[#2D3748]/60 flex items-center gap-1">
              <Briefcase size={14} /> ตำแหน่งงาน
            </Label>
            <select 
              required
              value={formData.position}
              onChange={e => setFormData({...formData, position: e.target.value})}
              className="w-full h-11 rounded-xl border border-[#2D3748]/10 bg-white/50 px-3 text-sm focus:ring-2 focus:ring-[#4A7C59]/20 outline-none"
            >
              <option value="">เลือกตำแหน่ง...</option>
              {positions?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <Button 
          disabled={mutation.isPending}
          className="bg-[#4A7C59] hover:bg-[#3d664a] text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-[#4A7C59]/20 gap-2 transition-all active:scale-95"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          ยืนยันการบันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
}