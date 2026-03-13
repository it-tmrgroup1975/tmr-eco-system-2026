// frontend/src/hooks/useEmployeeList.ts
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEmployeeActions } from "./useEmployeeActions";
import { employeeApi } from "../api/employeeApi";
import type { Employee, Department, Position } from "../types/employee";

export const useEmployeeList = () => {
  // --- UI State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // เพิ่ม State สำหรับเปิด-ปิด Sheet ตัวกรอง
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // --- Search & Filter State ---
  const [activeDept, setActiveDept] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // ปรับปรุง filters ให้รองรับช่วงวันที่ (Date Range)
  const [filters, setFilters] = useState({
    employment_type: "",
    position: "",
    start_date: "", // เพิ่มวันที่เริ่มต้น
    end_date: "",   // เพิ่มวันที่สิ้นสุด
  });

  const { deleteEmployee } = useEmployeeActions();

  // 1. ดึงข้อมูลแผนก
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: () => employeeApi.getDepartments(),
  });

  // 2. ดึงข้อมูลตำแหน่งงาน (สำหรับใช้ใน Advanced Filter Dropdown)
  const { data: positions = [] } = useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: () => employeeApi.getPositions(),
  });

  // 3. ดึงข้อมูลพนักงาน (Refetch อัตโนมัติเมื่อ activeDept, searchTerm หรือ filters เปลี่ยน)
  const { data: employees, isLoading, isError } = useQuery<Employee[]>({
    queryKey: ["employees", activeDept, searchTerm, filters],
    queryFn: () =>
      employeeApi.getAll({
        department: activeDept === "all" ? undefined : activeDept,
        search: searchTerm || undefined,
        ...filters, // ส่งค่า employment_type, position, start_date, end_date ไปยัง API
      }),
  });

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

  return {
    state: { 
      isDialogOpen, 
      isFilterOpen, // ส่งสถานะการเปิดตัวกรอง
      selectedEmployee, 
      formMode, 
      viewMode, 
      activeDept, 
      departments, 
      positions, // ส่งข้อมูลตำแหน่งงานออกไปใช้งาน
      employees, 
      isLoading, 
      isError, 
      searchTerm, 
      filters 
    },
    actions: { 
      setIsDialogOpen, 
      setIsFilterOpen, // ส่งฟังก์ชันเปิด-ปิดตัวกรอง
      setViewMode, 
      setActiveDept, 
      setSearchTerm, 
      setFilters, 
      handleOpenForm, 
      handleDelete 
    }
  };
};