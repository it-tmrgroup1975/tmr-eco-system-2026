// frontend/src/hooks/useEmployeeForm.ts
import { useState, useRef, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeApi } from "../api/employeeApi";
import type { Employee, Department, Position } from "../types/employee";

export interface EmployeeFormInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  employment_type: string;
  department: string;
  position: string;
}

export const useEmployeeForm = (
  employee: Employee | null | undefined, 
  mode: "create" | "edit" | "view", 
  onSuccess: () => void
) => {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ดึงข้อมูล Master Data
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const { data: positions } = useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: () => employeeApi.getPositions(),
  });

  const form = useForm<EmployeeFormInput>({
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

  const watchDepartment = form.watch("department");

  // กรองตำแหน่งงาน
  const filteredPositions = useMemo(() => {
    if (!watchDepartment || !positions) return [];
    return positions.filter(pos => {
      const posDeptId = typeof pos.department === 'object'
        ? String((pos.department as any).id)
        : String(pos.department);
      return posDeptId === String(watchDepartment);
    });
  }, [watchDepartment, positions]);

  // โหลดข้อมูลพนักงานกรณี Edit/View
  useEffect(() => {
    if (employee) {
      // ดึง ID สำหรับ Select (จัดการทั้งกรณี ID หรือ Object ที่อาจมาจาก API)
      const deptId = typeof employee.department === 'object' ? String((employee.department as any).id) : String(employee.department || "");
      const posId = typeof employee.position === 'object' ? String((employee.position as any).id) : String(employee.position || "");

      form.reset({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        phone_number: employee.phone_number || "",
        employment_type: employee.employment_type || "full_time",
        department: deptId,
        position: posId,
      });
      setPreviewUrl(employee.avatar || null);
    }
  }, [employee, form]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (isEditMode && employee?.id) return employeeApi.update(employee.id, data);
      return employeeApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(isEditMode ? "อัปเดตข้อมูลสำเร็จ" : "สร้างพนักงานใหม่สำเร็จ");
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

  const onSubmit = (data: EmployeeFormInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append("username", data.email);
    if (selectedFile) formData.append("avatar", selectedFile);
    mutation.mutate(formData);
  };

  return {
    form,
    departments,
    filteredPositions,
    photo: { previewUrl, setPreviewUrl, fileInputRef, setSelectedFile, selectedFile },
    isPending: mutation.isPending,
    onSubmit
  };
};