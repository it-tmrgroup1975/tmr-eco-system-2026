import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader2, Save, X, Camera, Phone } from "lucide-react";
import type { Employee, Department, Position } from "../../../types/employee";
import { employeeApi } from "../../../api/employeeApi";
import { cn } from "../../../lib/utils";

interface EmployeeFormProps {
  employee?: Employee | null;
  mode: "create" | "edit" | "view";
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, mode, onSuccess }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. ดึงข้อมูล Master Data
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const { data: positions } = useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: () => employeeApi.getPositions(),
  });

  // 2. Setup Form
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      employment_type: "full_time",
      department: "",
      position: "",
    },
  });

  const watchDepartment = watch("department");
  const watchPosition = watch("position");
  const watchEmploymentType = watch("employment_type");

  useEffect(() => {
    if (employee) {
      reset({
        ...employee,
        department: employee.department ? String(employee.department) : "",
        position: employee.position ? String(employee.position) : "",
        employment_type: employee.employment_type || "full_time",
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        phone_number: employee.phone_number || "",
      });
      setPreviewUrl(employee.avatar || null);
      setSelectedFile(null); // ล้างไฟล์ที่เคยเลือกไว้เมื่อสลับข้อมูลพนักงาน
    } else {
      reset({ 
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        employment_type: "full_time",
        department: "",
        position: ""
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [employee, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewMode) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isViewMode) return;
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (isEditMode && employee?.id) {
        return employeeApi.update(employee.id, formData);
      }
      return employeeApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(isEditMode ? "อัปเดตข้อมูลพนักงานสำเร็จ" : "เพิ่มพนักงานใหม่เข้าสู่ระบบแล้ว");
      onSuccess();
    },
    onError: (error: any) => {
      const serverError = error.response?.data;
      const message = typeof serverError === 'object'
        ? Object.values(serverError).flat().join(", ")
        : "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      toast.error(message);
    },
  });

  const onSubmit = (data: any) => {
    if (isViewMode) return;
    const formData = new FormData();
    formData.append("first_name", data.first_name || "");
    formData.append("last_name", data.last_name || "");
    formData.append("email", data.email || "");
    formData.append("username", data.email || ""); // ใช้ email เป็น username ตาม logic ธุรกิจ
    formData.append("phone_number", data.phone_number || "");
    formData.append("employment_type", data.employment_type || "full_time");
    
    if (data.department) formData.append("department", String(data.department));
    if (data.position) formData.append("position", String(data.position));
    
    if (selectedFile instanceof File) {
      formData.append("avatar", selectedFile);
    }
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-thai animate-in fade-in duration-500">
      {/* Photo Section */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-4">
        <div className="relative group">
          <div
            onClick={() => !isViewMode && fileInputRef.current?.click()}
            className={cn(
              "w-28 h-28 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all shadow-inner",
              isViewMode 
                ? "cursor-default border-[#4A7C59]/10 bg-slate-50" 
                : "cursor-pointer border-[#4A7C59]/20 bg-[#4A7C59]/5 hover:border-[#4A7C59]/50 hover:bg-[#4A7C59]/10"
            )}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-[#4A7C59]/40">
                <Camera size={28} />
                <span className="text-[10px] font-black mt-1 tracking-widest uppercase">Photo</span>
              </div>
            )}
          </div>

          {previewUrl && !isViewMode && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <p className="text-[11px] font-bold text-[#2D3748]/40 uppercase tracking-tighter">
          {isViewMode ? "โปรไฟล์บุคลากร (อ่านอย่างเดียว)" : "รูปภาพประจำตัว (JPG/PNG)"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-[#2D3748]/70 font-bold">ชื่อจริง</Label>
          <Input
            id="first_name"
            disabled={isViewMode}
            {...register("first_name", { required: !isViewMode && "กรุณากรอกชื่อจริง" })}
            className={cn("rounded-xl border-[#4A7C59]/10 transition-all", errors.first_name && "border-destructive focus-visible:ring-destructive")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-[#2D3748]/70 font-bold">นามสกุล</Label>
          <Input
            id="last_name"
            disabled={isViewMode}
            {...register("last_name", { required: !isViewMode && "กรุณากรอกนามสกุล" })}
            className={cn("rounded-xl border-[#4A7C59]/10 transition-all", errors.last_name && "border-destructive focus-visible:ring-destructive")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#2D3748]/70 font-bold">อีเมลหน่วยงาน</Label>
          <Input
            id="email"
            type="email"
            disabled={isViewMode}
            {...register("email", { required: !isViewMode && "กรุณากรอกอีเมล" })}
            className="rounded-xl border-[#4A7C59]/10 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-[#2D3748]/70 font-bold">เบอร์โทรศัพท์</Label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A7C59]/40" />
            <Input
              id="phone_number"
              disabled={isViewMode}
              {...register("phone_number")}
              className="rounded-xl border-[#4A7C59]/10 pl-10 transition-all"
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">แผนก</Label>
          <Select
            disabled={isViewMode}
            onValueChange={(val) => setValue("department", val)}
            value={watchDepartment || ""}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue placeholder="เลือกแผนก" />
            </SelectTrigger>
            <SelectContent className="font-thai rounded-2xl">
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)} className="rounded-xl">{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">ตำแหน่ง</Label>
          <Select
            disabled={isViewMode}
            onValueChange={(val) => setValue("position", val)}
            value={watchPosition || ""}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue placeholder="เลือกตำแหน่ง" />
            </SelectTrigger>
            <SelectContent className="font-thai rounded-2xl">
              {positions?.map((pos) => (
                <SelectItem key={pos.id} value={String(pos.id)} className="rounded-xl">{pos.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[#2D3748]/70 font-bold">ประเภทการจ้างงาน</Label>
          <Select
            disabled={isViewMode}
            onValueChange={(val) => setValue("employment_type", val)}
            value={watchEmploymentType || ""}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-thai rounded-2xl">
              <SelectItem value="full_time" className="rounded-xl">พนักงานประจำ (Full-time)</SelectItem>
              <SelectItem value="contract" className="rounded-xl">สัญญาจ้าง (Contract)</SelectItem>
              <SelectItem value="part_time" className="rounded-xl">พนักงานชั่วคราว (Part-time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[#2D3748]/5">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onSuccess} 
          className="rounded-xl text-[#2D3748]/40 hover:text-red-500 transition-colors"
        >
          {isViewMode ? "ปิดหน้าต่าง" : "ยกเลิกการแก้ไข"}
        </Button>
        
        {!isViewMode && (
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-xl px-10 h-12 shadow-lg shadow-[#4A7C59]/20 gap-2 font-bold active:scale-95 transition-all"
          >
            {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
            {isEditMode ? "บันทึกการเปลี่ยนแปลง" : "สร้างโปรไฟล์บุคลากร"}
          </Button>
        )}
      </div>
    </form>
  );
}