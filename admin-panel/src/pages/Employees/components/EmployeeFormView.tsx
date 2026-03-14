// frontend/src/pages/Employees/components/EmployeeFormView.tsx
import React from "react";
import { useEmployeeForm } from "../../../hooks/useEmployeeForm";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Loader2, Save, Phone, Hash, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Employee, EmploymentType, UserRole } from "../../../types/employee";
import { AvatarSection } from "../../../components/AvatarUpload";

interface EmployeeFormProps {
  employee?: Employee | null;
  mode: "create" | "edit" | "view";
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, mode, onSuccess }: EmployeeFormProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  
  const { form, departments, filteredPositions, photo, isPending, onSubmit } = useEmployeeForm(employee ?? null, mode, onSuccess);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  
  // Watch values for logic and controlled components
  const watchDepartment = watch("department");
  const watchPosition = watch("position");
  const watchEmploymentType = watch("employment_type");
  const watchRole = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-thai animate-in fade-in zoom-in-95 duration-500">
      {/* Avatar Section */}
      <AvatarSection
        previewUrl={photo.previewUrl}
        isViewMode={isViewMode}
        fileInputRef={photo.fileInputRef as React.RefObject<HTMLInputElement>}
        onFileChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            photo.setSelectedFile(file);
            photo.setPreviewUrl(URL.createObjectURL(file));
          }
        }}
        onRemove={(e) => {
          e.stopPropagation();
          photo.setSelectedFile(null);
          photo.setPreviewUrl(null);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee ID - สำคัญสำหรับ ERP */}
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold flex items-center gap-2">
            <Hash size={14} /> รหัสพนักงาน
          </Label>
          <Input 
            // disabled={isViewMode || isEditMode} 
            {...register("employee_id", { required: "กรุณากรอกรหัสพนักงาน" })} 
            placeholder="เช่น EMP001"
            className={cn("rounded-xl border-sage-200", errors.employee_id && "border-destructive bg-destructive/5")} 
          />
          {errors.employee_id && <p className="text-xs text-destructive">{errors.employee_id.message}</p>}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold flex items-center gap-2">
            <ShieldCheck size={14} /> บทบาท (Role)
          </Label>
          <Select 
            disabled={isViewMode} 
            onValueChange={(val) => setValue("role", val as UserRole)} 
            value={watchRole ?? ""}
          >
            <SelectTrigger className="rounded-xl border-sage-200 w-full">
              <SelectValue placeholder="เลือกบทบาท" />
            </SelectTrigger>
            <SelectContent className="font-thai">
              <SelectItem value="admin">Admin (ผู้ดูแลระบบ)</SelectItem>
              <SelectItem value="manager">Manager (ผู้จัดการ)</SelectItem>
              <SelectItem value="hr">HR (ทรัพยากรบุคคล)</SelectItem>
              <SelectItem value="employee">Employee (พนักงานทั่วไป)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name Fields */}
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">ชื่อจริง</Label>
          <Input 
            disabled={isViewMode} 
            {...register("first_name", { required: "กรุณากรอกชื่อจริง" })} 
            className={cn("rounded-xl border-sage-200", errors.first_name && "border-destructive")} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">นามสกุล</Label>
          <Input 
            disabled={isViewMode} 
            {...register("last_name", { required: "กรุณากรอกนามสกุล" })} 
            className={cn("rounded-xl border-sage-200", errors.last_name && "border-destructive")} 
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">อีเมลหน่วยงาน</Label>
          <Input 
            type="email" 
            disabled={isViewMode} 
            {...register("email", { required: "กรุณากรอกอีเมล" })} 
            className="rounded-xl border-sage-200" 
            placeholder="example@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">เบอร์โทรศัพท์</Label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A7C59]/40" />
            <Input 
              disabled={isViewMode} 
              {...register("phone_number")} 
              className="rounded-xl pl-10 border-sage-200" 
              placeholder="08X-XXX-XXXX" 
            />
          </div>
        </div>

        {/* Department & Position */}
        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">แผนก</Label>
          <Select 
            disabled={isViewMode} 
            onValueChange={(val) => { 
              setValue("department", val, { shouldValidate: true }); 
              setValue("position", ""); // Reset position when department changes
            }} 
            value={watchDepartment ? String(watchDepartment) : ""}
          >
            <SelectTrigger className={cn("rounded-xl border-sage-200 w-full", errors.department && "border-destructive")}>
              <SelectValue placeholder="เลือกแผนก" />
            </SelectTrigger>
            <SelectContent className="font-thai">
              {departments?.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[#2D3748]/70 font-bold">ตำแหน่ง</Label>
          <Select 
            disabled={isViewMode || !watchDepartment} 
            onValueChange={(val) => setValue("position", val, { shouldValidate: true })} 
            value={watchPosition ? String(watchPosition) : ""}
          >
            <SelectTrigger className={cn("rounded-xl border-sage-2000 w-full", errors.position && "border-destructive")}>
              <SelectValue placeholder={!watchDepartment ? "กรุณาเลือกแผนกก่อน" : "เลือกตำแหน่ง"} />
            </SelectTrigger>
            <SelectContent className="font-thai">
              {filteredPositions.map((pos) => (
                <SelectItem key={pos.id} value={String(pos.id)}>{pos.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-[#2D3748]/70 font-bold">ประเภทการจ้างงาน</Label>
          <Select 
            disabled={isViewMode} 
            onValueChange={(val) => setValue("employment_type", (val as EmploymentType))} 
            value={watchEmploymentType}
          >
            <SelectTrigger className="rounded-xl border-sage-2000 w-full h-[50px]">
              <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
            </SelectTrigger>
            <SelectContent className="font-thai">
              <SelectItem value="full_time">พนักงานประจำ (Full-time)</SelectItem>
              <SelectItem value="contract">สัญญาจ้าง (Contract)</SelectItem>
              <SelectItem value="part_time">พนักงาน Part Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess} 
          className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          {isViewMode ? "ปิดหน้าต่าง" : "ยกเลิก"}
        </Button>
        
        {!isViewMode && (
          <Button 
            type="submit" 
            disabled={isPending} 
            className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-xl px-10 h-12 shadow-md hover:shadow-lg transition-all font-bold gap-2"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save size={18} />
                {mode === "edit" ? "บันทึกข้อมูล" : "สร้างโปรไฟล์พนักงาน"}
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}