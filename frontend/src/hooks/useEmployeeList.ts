// frontend/src/hooks/useEmployeeList.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeActions } from "./useEmployeeActions";
import type { Department, Employee } from "../types/employee";
import { employeeApi } from "../api/employeeApi";

export const useEmployeeList = () => {
  // --- UI & Dialog State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // --- Search & Filter State ---
  const [activeDept, setActiveDept] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    employment_type: "",
    position: "",
  });

  const { deleteEmployee } = useEmployeeActions();

  // ดึงข้อมูลแผนกสำหรับแสดงใน Header
  const { data: departmentsData } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  const departments = ["ทั้งหมด", ...(departmentsData?.map((dept) => dept.name) || [])];

  // ดึงข้อมูลพนักงาน: ระบบจะ Auto-refetch เมื่อ activeDept, searchTerm หรือ filters เปลี่ยน
  const { data: employees, isLoading, isError } = useQuery<Employee[]>({
    queryKey: ["employees", activeDept, searchTerm, filters],
    queryFn: () =>
      employeeApi.getAll({
        department: activeDept === "ทั้งหมด" ? undefined : activeDept,
        search: searchTerm || undefined,
        employment_type: filters.employment_type || undefined,
        position: filters.position || undefined,
      }),
  });

  const handleOpenForm = (mode: "create" | "edit" | "view", emp: Employee | null = null) => {
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
    state: {
      isDialogOpen,
      selectedEmployee,
      formMode,
      viewMode,
      activeDept,
      departments,
      employees,
      isLoading,
      isError,
      searchTerm,
      filters,
    },
    actions: {
      setIsDialogOpen,
      setSelectedEmployee,
      setFormMode,
      setViewMode,
      setActiveDept,
      setSearchTerm,
      setFilters,
      handleOpenForm,
      handleDelete,
    },
  };
};