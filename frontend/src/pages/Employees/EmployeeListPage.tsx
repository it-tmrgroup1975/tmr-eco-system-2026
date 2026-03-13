// frontend/src/pages/Employees/EmployeeListPage.tsx
import { useEmployeeList } from "../../hooks/useEmployeeList";
import { EmployeeListHeader } from "./components/EmployeeListHeader";
import { EmployeeTableView } from "./components/EmployeeTableView";
import { EmployeeKanbanCard } from "./components/EmployeeKanbanCard";
import { EmployeeFormDialog } from "./components/EmployeeFormDialog";
import { EmployeeSkeleton } from "./components/EmployeeSkeleton";

export default function EmployeeListPage() {
  const { state, actions } = useEmployeeList();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* เชื่อมต่อ State และ Actions สำหรับระบบ Search */}
      <EmployeeListHeader 
        departments={state.departments}
        activeDept={state.activeDept}
        viewMode={state.viewMode}
        searchTerm={state.searchTerm} //
        onSearchChange={actions.setSearchTerm} //
        onViewModeChange={actions.setViewMode}
        onDeptChange={actions.setActiveDept}
        onAddClick={() => actions.handleOpenForm("create")}
      />

      {state.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <EmployeeSkeleton key={i} />)}
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {/* แสดงผลข้อความเมื่อค้นหาไม่พบพนักงาน */}
          {!state.employees || state.employees.length === 0 ? (
            <div className="py-20 text-center text-[#2D3748]/40 font-thai bg-white/20 rounded-3xl border border-dashed border-[#2D3748]/10">
              ไม่พบข้อมูลพนักงานที่ค้นหา
            </div>
          ) : state.viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
              {state.employees.map((emp) => (
                <EmployeeKanbanCard key={emp.id} employee={emp} onAction={actions.handleOpenForm} />
              ))}
            </div>
          ) : (
            <EmployeeTableView 
              employees={state.employees} 
              onAction={actions.handleOpenForm}
              onDelete={actions.handleDelete}
            />
          )}
        </div>
      )}

      <EmployeeFormDialog 
        isOpen={state.isDialogOpen}
        mode={state.formMode}
        employee={state.selectedEmployee}
        onOpenChange={actions.setIsDialogOpen}
        onSuccess={() => {
          actions.setIsDialogOpen(false);
          actions.handleOpenForm("create");
        }}
      />
    </div>
  );
}