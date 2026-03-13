// frontend/src/hooks/useEmployeeList.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeActions } from "./useEmployeeActions";
import type { Department, Employee } from "../types/employee";
import { employeeApi } from "../api/employeeApi";

export const useEmployeeList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [activeDept, setActiveDept] = useState("ทั้งหมด");
  const { deleteEmployee } = useEmployeeActions();

  // ดึงข้อมูลแผนก
  const { data: departmentsData } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const departments = ["ทั้งหมด", ...(departmentsData?.map((dept) => dept.name) || [])];

  // ดึงข้อมูลพนักงานตามแผนก
  const { data: employees, isLoading, isError } = useQuery<Employee[]>({
    queryKey: ["employees", activeDept],
    queryFn: () => employeeApi.getAll({
      department: activeDept === "ทั้งหมด" ? undefined : activeDept
    }),
  });

  const handleOpenForm = (mode: "create" | "edit" | "view", emp: Employee | null = null) => {
    setSelectedEmployee(null);
    setFormMode(mode);
    setSelectedEmployee(emp);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณต้องการลบข้อมูลพนักงานท่านนี้ใช่หรือไม่?")) {
      deleteEmployee(id);
    }
  };

  return {
    state: { isDialogOpen, selectedEmployee, formMode, viewMode, activeDept, departments, employees, isLoading, isError },
    actions: { setIsDialogOpen, setSelectedEmployee, setFormMode, setViewMode, setActiveDept, handleOpenForm, handleDelete }
  };
};