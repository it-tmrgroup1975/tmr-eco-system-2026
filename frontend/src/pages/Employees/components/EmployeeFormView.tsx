import { useEffect, useState } from "react";
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
import { Loader2, Save, X } from "lucide-react";
import type { Employee } from "../../../types/employee";
import { employeeApi } from "../../../api/employeeApi";

interface EmployeeFormProps {
  employee?: Employee | null; // ถ้ามีค่าแสดงว่าเป็นโหมดแก้ไข
  onSuccess: () => void;
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!employee;

  // 1. ดึงข้อมูล Master Data จาก Backend
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: () => employeeApi.getPositions(),
  });

  // 2. Setup Form ด้วย React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Employee>>({
    defaultValues: {
      employment_type: "FULL_TIME",
    },
  });

  // โหลดข้อมูลใส่ Form เมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (employee) {
      reset(employee);
    }
  }, [employee, reset]);

  // 3. Mutation สำหรับ Create/Update
  const mutation = useMutation({
    mutationFn: (data: Partial<Employee>) => {
      if (isEditMode && employee?.id) {
        return employeeApi.update(employee.id, data);
      }
      return employeeApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(isEditMode ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มพนักงานใหม่สำเร็จ");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    },
  });

  const onSubmit = (data: Partial<Employee>) => {
    const payload = {
      ...data,
      username: data.email, // ส่ง email ไปเป็น username เพื่อแก้ปัญหา field required
      // หากยังไม่แก้ Backend ให้แปลงเป็นพิมพ์เล็กก่อนส่ง
      employment_type: data.employment_type?.toLowerCase(),
    };
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-thai">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ชื่อ - นามสกุล */}
        <div className="space-y-2">
          <Label htmlFor="first_name">ชื่อจริง</Label>
          <Input
            id="first_name"
            {...register("first_name", { required: "กรุณากรอกชื่อจริง" })}
            className={errors.first_name ? "border-destructive" : ""}
          />
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">นามสกุล</Label>
          <Input
            id="last_name"
            {...register("last_name", { required: "กรุณากรอกนามสกุล" })}
            className={errors.last_name ? "border-destructive" : ""}
          />
          {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
        </div>

        {/* อีเมล */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">อีเมลหน่วยงาน</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "กรุณากรอกอีเมล",
              pattern: { value: /^\S+@\S+$/i, message: "รูปแบบอีเมลไม่ถูกต้อง" }
            })}
          />
        </div>

        {/* แผนก และ ตำแหน่ง (Dynamic จาก Backend) */}
        <div className="space-y-2">
          <Label>แผนก</Label>
          <Select
            onValueChange={(val) => setValue("department", val)}
            defaultValue={employee?.department}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกแผนก" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>ตำแหน่ง</Label>
          <Select
            onValueChange={(val) => setValue("position", val)}
            defaultValue={employee?.position}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกตำแหน่ง" />
            </SelectTrigger>
            <SelectContent>
              {positions?.map((pos: any) => (
                <SelectItem key={pos.id} value={pos.name}>{pos.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ประเภทการจ้างงาน */}
        <div className="space-y-2">
          <Label>ประเภทการจ้างงาน</Label>
          <Select
            onValueChange={(val: any) => setValue("employment_type", val)}
            defaultValue={employee?.employment_type || "FULL_TIME"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">พนักงานประจำ (Full-time)</SelectItem>
              <SelectItem value="PART_TIME">พนักงานชั่วคราว (Part-time)</SelectItem>
              <SelectItem value="CONTRACT">สัญญาจ้าง (Contract)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onSuccess} className="rounded-xl">
          <X className="mr-2 h-4 w-4" /> ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-xl px-8 shadow-lg shadow-[#4A7C59]/20"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? "บันทึกการแก้ไข" : "สร้างโปรไฟล์พนักงาน"}
        </Button>
      </div>
    </form>
  );
}