import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeActions } from "./useEmployeeActions";
import { employeeApi } from "../api/employeeApi";
import type { Employee, Department, Position } from "../types/employee";

export const useEmployeeList = () => {
  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // --- UI State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // --- Search & Filter State ---
  const [activeDept, setActiveDept] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    employment_type: "",
    position: "",
    start_date: "",
    end_date: "",
  });

  const { deleteEmployee } = useEmployeeActions();

  // 1. ดึงข้อมูลแผนก/ตำแหน่ง
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: employeeApi.getDepartments
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["positions"],
    queryFn: employeeApi.getPositions
  });

  // 2. ดึงข้อมูลพนักงานแบบ Pagination
  // รวมค่าทั้งหมดที่ส่งผลต่อข้อมูลเข้าใน queryKey
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["employees", activeDept, searchTerm, filters, page, pageSize],
    queryFn: () =>
      employeeApi.getAll({
        page,
        page_size: pageSize,
        department: activeDept === "all" ? undefined : activeDept,
        search: searchTerm || undefined,
        ...filters,
      }),
  });

  // Action สำหรับการรีเฟรชข้อมูล
  const handleRefresh = () => refetch();

  const handleOpenForm = (mode: "create" | "edit" | "view", emp: Employee | null = null) => {
    setFormMode(mode);
    setSelectedEmployee(emp);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("คุณต้องการลบข้อมูลพนักงานท่านนี้ใช่หรือไม่?")) {
      deleteEmployee(id);
    }
  };

  console.log("API Data:", data)

  return {
    state: {
      isDialogOpen,
      isFilterOpen,
      selectedEmployee,
      formMode,
      viewMode,
      activeDept,
      departments,
      positions,
      // เจาะจงดึงข้อมูลพนักงานจาก results ที่ได้จาก Pagination ของ Backend
      employees: data?.results || [],
      totalCount: data?.count || 0,
      totalPages: Math.ceil((data?.count || 0) / pageSize),
      currentPage: page,
      isLoading,
      isError,
      searchTerm,
      filters
    },
    actions: {
      setIsDialogOpen,
      setIsFilterOpen,
      setViewMode,
      // เมื่อเปลี่ยนแผนก ให้กลับไปเริ่มหน้า 1 เสมอ
      setActiveDept: (id: string) => { setActiveDept(id); setPage(1); },
      // ค้นหาใหม่ให้กลับไปหน้า 1
      setSearchTerm: (val: string) => { setSearchTerm(val); setPage(1); },
      // กรองใหม่ให้กลับไปหน้า 1
      setFilters: (val: any) => { setFilters(val); setPage(1); },
      setPage,
      handleOpenForm,
      handleDelete,
      handleRefresh
    }
  };
};