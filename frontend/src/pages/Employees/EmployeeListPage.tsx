import { useEmployeeList } from "../../hooks/useEmployeeList";
import { EmployeeListHeader } from "./components/EmployeeListHeader";
import { EmployeeTableView } from "./components/EmployeeTableView";
import { EmployeeKanbanCard } from "./components/EmployeeKanbanCard";
import { EmployeeFormDialog } from "./components/EmployeeFormDialog";
import { EmployeeSkeleton } from "./components/EmployeeSkeleton";
import { AdvancedFilterSheet } from "./components/AdvancedFilterSheet";
import { toast } from "sonner";
import { exportEmployees, importEmployees } from "../../api/employeeApi";
import { Button } from "../../components/ui/button"; // นำเข้า Button จาก ShadCN
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"; // นำเข้าไอคอนสำหรับ Pagination
import { cn } from "../../lib/utils";

export default function EmployeeListPage() {
  const { state, actions } = useEmployeeList();

  // --- Logic สำหรับการ Export ข้อมูลพนักงาน ---
  const handleExport = async () => {
    try {
      await exportEmployees();
      toast.success("ดาวน์โหลดไฟล์ข้อมูลพนักงานสำเร็จ", {
        description: `ข้อมูล ณ วันที่ ${new Date().toLocaleDateString('th-TH')}`,
      });
    } catch (error) {
      toast.error("ไม่สามารถส่งออกข้อมูลได้", {
        description: "โปรดตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์",
      });
    }
  };

  // --- Logic สำหรับการ Import ข้อมูลพนักงาน ---
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("กำลังนำเข้าข้อมูลพนักงาน...");

    try {
      const result = await importEmployees(file);
      actions.handleRefresh();
      toast.success("นำเข้าข้อมูลสำเร็จ", {
        id: toastId,
        description: result.message || `นำเข้าพนักงานเรียบร้อยแล้ว`,
      });
      e.target.value = "";
    } catch (error: any) {
      toast.error("การนำเข้าข้อมูลล้มเหลว", {
        id: toastId,
        description: error.response?.data?.error || "รูปแบบไฟล์ไม่ถูกต้อง",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* 1. ส่วนหัวและแถบค้นหา */}
      <EmployeeListHeader
        departments={state.departments}
        activeDept={state.activeDept}
        viewMode={state.viewMode}
        searchTerm={state.searchTerm}
        onSearchChange={actions.setSearchTerm}
        onViewModeChange={actions.setViewMode}
        onDeptChange={actions.setActiveDept}
        onAddClick={() => actions.handleOpenForm("create")}
        onAdvancedFilterClick={() => actions.setIsFilterOpen(true)}
        onExportClick={handleExport}
        onImportChange={handleImport}
      />

      {/* 2. ส่วนแสดงรายชื่อพนักงาน */}
      {state.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* แสดง Skeleton เมื่อกำลังโหลดหน้าใหม่ */}
          {[...Array(8)].map((_, i) => <EmployeeSkeleton key={i} />)}
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {state.employees.length === 0 ? (
            <div className="py-20 text-center ...">
              ไม่พบข้อมูลพนักงานที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            <>
              {state.viewMode === "kanban" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
                  {state.employees.map((emp) => (
                    // เพิ่ม key={emp.id} เพื่อช่วย React ในการทำ Reconciliation
                    <EmployeeKanbanCard key={emp.id} employee={emp} onAction={actions.handleOpenForm} />
                  ))}
                </div>
              ) : (
                <EmployeeTableView
                  // ตรวจสอบให้แน่ใจว่า state.employees ตรงนี้คือ Array ของพนักงานจริง (data.results)
                  employees={state.employees}
                  onAction={actions.handleOpenForm}
                  onDelete={actions.handleDelete}
                />
              )}

              {/* --- 3. ส่วนควบคุมเลขหน้า (Pagination Controls) --- */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/40 shadow-sm">
                <div className="text-sm font-medium text-[#2D3748]/60 font-thai">
                  ทั้งหมด <span className="text-[#4A7C59] font-bold">{state.totalCount || 0}</span> รายการ
                  (หน้า {state.currentPage} จาก {state.totalPages})
                </div>

                <div className="flex items-center gap-2">
                  {/* ปุ่มไปหน้าแรก/ก่อนหน้า */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#2D3748]/10 hover:bg-[#4A7C59]/10 hover:text-[#4A7C59] transition-all"
                    onClick={() => actions.setPage(1)}
                    disabled={state.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl border-[#2D3748]/10 font-thai font-bold gap-2 hover:bg-[#4A7C59]/10 hover:text-[#4A7C59]"
                    onClick={() => actions.setPage(state.currentPage - 1)}
                    disabled={state.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    ก่อนหน้า
                  </Button>

                  {/* เลขหน้าแบบ Dynamic */}
                  <div className="hidden md:flex items-center gap-1 mx-2">
                    {[...Array(state.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // แสดงเฉพาะหน้าแรก, หน้าสุดท้าย และหน้าใกล้เคียงปัจจุบัน
                      if (
                        pageNum === 1 ||
                        pageNum === state.totalPages ||
                        (pageNum >= state.currentPage - 1 && pageNum <= state.currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={state.currentPage === pageNum ? "default" : "ghost"}
                            className={cn(
                              "w-10 h-10 rounded-xl font-bold transition-all",
                              state.currentPage === pageNum
                                ? "bg-[#4A7C59] text-white shadow-md shadow-[#4A7C59]/20 hover:bg-[#3d664a]"
                                : "text-[#2D3748]/40 hover:bg-[#4A7C59]/10 hover:text-[#4A7C59]"
                            )}
                            onClick={() => actions.setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      // แสดงเครื่องหมาย ...
                      if (pageNum === 2 || pageNum === state.totalPages - 1) {
                        return <MoreHorizontal key={pageNum} className="text-[#2D3748]/20 w-4 h-4" />;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl border-[#2D3748]/10 font-thai font-bold gap-2 hover:bg-[#4A7C59]/10 hover:text-[#4A7C59]"
                    onClick={() => actions.setPage(state.currentPage + 1)}
                    disabled={state.currentPage === state.totalPages}
                  >
                    ถัดไป
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#2D3748]/10 hover:bg-[#4A7C59]/10 hover:text-[#4A7C59] transition-all"
                    onClick={() => actions.setPage(state.totalPages)}
                    disabled={state.currentPage === state.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 4. หน้าต่างตัวกรองขั้นสูง (Advanced Filter Sheet) */}
      <AdvancedFilterSheet
        isOpen={state.isFilterOpen}
        onOpenChange={actions.setIsFilterOpen}
        positions={state.positions}
        filters={state.filters}
        onApply={actions.setFilters}
      />

      {/* 5. ฟอร์มเพิ่ม/แก้ไขข้อมูลพนักงาน (Dialog) */}
      <EmployeeFormDialog
        isOpen={state.isDialogOpen}
        mode={state.formMode}
        employee={state.selectedEmployee}
        onOpenChange={actions.setIsDialogOpen}
        onSuccess={() => {
          actions.setIsDialogOpen(false);
          actions.handleRefresh();
        }}
      />
    </div>
  );
}