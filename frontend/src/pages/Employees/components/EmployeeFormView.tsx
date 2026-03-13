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

interface EmployeeFormProps {
  employee?: Employee | null; // ถ้ามีค่าแสดงว่าเป็นโหมดแก้ไข
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!employee;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- State สำหรับรูปภาพ ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. ดึงข้อมูล Master Data จาก Backend
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const { data: positions } = useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: () => employeeApi.getPositions(),
  });

  // 2. Setup Form ด้วย React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Employee>>({
    defaultValues: {
      employment_type: "full_time",
    },
  });

  // โหลดข้อมูลใส่ Form เมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (employee) {
      reset(employee);
      if (employee.avatar) setPreviewUrl(employee.avatar);
    }
  }, [employee, reset]);

  // ฟังก์ชันจัดการรูปภาพ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3. Mutation สำหรับ Create/Update
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (isEditMode && employee?.id) {
        return employeeApi.update(employee.id, formData);
      }
      return employeeApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(isEditMode ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มพนักงานใหม่สำเร็จ");
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

  const onSubmit = (data: Partial<Employee>) => {
    const formData = new FormData();

    // 1. ข้อมูล Text ปกติ
    formData.append("first_name", data.first_name || "");
    formData.append("last_name", data.last_name || "");
    formData.append("email", data.email || "");
    formData.append("username", data.email || "");
    formData.append("phone_number", data.phone_number || "");
    formData.append("employment_type", data.employment_type || "full_time");

    // 2. Foreign Keys (ต้องส่งเป็น ID)
    if (data.department) formData.append("department", String(data.department));
    if (data.position) formData.append("position", String(data.position));

    // 3. การส่งรูปภาพ (จุดสำคัญที่ทำให้เกิด Error)
    // ต้องตรวจสอบว่า selectedFile คืออ็อบเจกต์ File ไม่ใช่ String
    if (selectedFile instanceof File) {
      formData.append("avatar", selectedFile);
    }

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-thai">

      {/* --- ส่วนอัปโหลดรูปภาพ Avatar --- */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-4">
        <div className="relative group">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-[2.5rem] border-2 border-dashed border-[#4A7C59]/20 bg-[#4A7C59]/5 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[#4A7C59]/50 hover:bg-[#4A7C59]/10 shadow-inner"
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

          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <p className="text-[11px] font-bold text-[#2D3748]/40 uppercase tracking-tighter">Profile Picture (JPG/PNG)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-[#2D3748]/70 font-bold">ชื่อจริง</Label>
          <Input
            id="first_name"
            {...register("first_name", { required: "กรุณากรอกชื่อจริง" })}
            className={errors.first_name ? "border-destructive rounded-xl" : "rounded-xl border-[#4A7C59]/10"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-[#2D3748]/70 font-bold">นามสกุล</Label>
          <Input
            id="last_name"
            {...register("last_name", { required: "กรุณากรอกนามสกุล" })}
            className={errors.last_name ? "border-destructive rounded-xl" : "rounded-xl border-[#4A7C59]/10"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#2D3748]/70 font-bold">อีเมลหน่วยงาน</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "กรุณากรอกอีเมล" })}
            className="rounded-xl border-[#4A7C59]/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-[#2D3748]/70 font-bold">เบอร์โทรศัพท์</Label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A7C59]/40" />
            <Input
              id="phone_number"
              {...register("phone_number")}
              className="rounded-xl border-[#4A7C59]/10 pl-10"
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">แผนก</Label>
          <Select
            onValueChange={(val) => setValue("department", Number(val) as any)} // ตรวจสอบว่ามี Number(val)
            defaultValue={employee?.department?.toString()}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue placeholder="เลือกแผนก" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">ตำแหน่ง</Label>
          <Select
            onValueChange={(val) => setValue("position", Number(val) as any)} // ตรวจสอบว่ามี Number(val)
            defaultValue={employee?.position?.toString()}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue placeholder="เลือกตำแหน่ง" />
            </SelectTrigger>
            <SelectContent>
              {positions?.map((pos) => (
                <SelectItem key={pos.id} value={pos.id.toString()}>{pos.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-[#2D3748]/70 font-bold">ประเภทการจ้างงาน</Label>
          <Select
            onValueChange={(val: any) => setValue("employment_type", val)}
            defaultValue={employee?.employment_type || "full_time"}
          >
            <SelectTrigger className="rounded-xl border-[#4A7C59]/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">พนักงานประจำ (Full-time)</SelectItem>
              <SelectItem value="contract">สัญญาจ้าง (Contract)</SelectItem>
              <SelectItem value="part_time">พนักงานชั่วคราว (Part-time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[#2D3748]/5">
        <Button type="button" variant="ghost" onClick={onSuccess} className="rounded-xl text-[#2D3748]/40 hover:text-red-500">
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-xl px-10 h-12 shadow-lg shadow-[#4A7C59]/20 gap-2 font-bold active:scale-95 transition-all"
        >
          {mutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isEditMode ? "อัปเดตข้อมูล" : "สร้างโปรไฟล์"}
        </Button>
      </div>
    </form>
  );
}