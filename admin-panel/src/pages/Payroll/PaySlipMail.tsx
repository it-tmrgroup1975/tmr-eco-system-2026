import { useState, useMemo, useDeferredValue } from "react";
import { usePayroll } from "../../hooks/usePayroll";
import { 
  Calendar, Filter, Search, Check, ChevronsUpDown, Send, FileSpreadsheet
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import type { PaymentCycle } from "../../types/payroll";

// Import Custom Components
import { PayslipSkeleton } from "./components/PayslipSkeleton";
import { HeaderSection } from "./components/HeaderSection";
import { ListView } from "./components/ListView";
import { KanbanView } from "./components/KanbanView";
import { PaginationControl } from "./components/PaginationControl";
import { Button } from "../../components/ui/button";

type EmailFilterStatus = "ALL" | "SENT" | "PENDING";
type ViewMode = "LIST" | "KANBAN";

export const AdminPayroll = () => {
  const { payslips, isLoading, sendEmails, isSending } = usePayroll();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  
  const [filterMonth, setFilterMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [viewCycle, setViewCycle] = useState<PaymentCycle | "ALL">("ALL");
  const [emailStatus, setEmailStatus] = useState<EmailFilterStatus>("ALL");
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'LIST' ? 10 : 6;

  const departments = useMemo(() => {
    if (!payslips) return [];
    const depts = new Set<string>();
    payslips.forEach(ps => { if (ps.employee_department) depts.add(ps.employee_department); });
    return Array.from(depts).sort();
  }, [payslips]);

  const filteredPayslips = useMemo(() => {
    if (!payslips) return [];
    return payslips.filter(ps => {
      const matchMonth = ps.period_month.toString() === filterMonth;
      const matchCycle = viewCycle === "ALL" || ps.cycle === viewCycle;
      const matchEmail = emailStatus === "ALL" ? true : (emailStatus === "SENT" ? ps.is_email_sent : !ps.is_email_sent);
      const matchEmployee = !selectedEmployee || ps.employee_name === selectedEmployee;
      const matchDept = !selectedDept || ps.employee_department === selectedDept;
      return matchMonth && matchCycle && matchEmail && matchEmployee && matchDept;
    });
  }, [payslips, filterMonth, viewCycle, emailStatus, selectedEmployee, selectedDept]);

  const totalPages = Math.ceil(filteredPayslips.length / itemsPerPage);
  const paginatedPayslips = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayslips.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayslips, currentPage, itemsPerPage]);

  const employeeOptions = useMemo(() => {
    if (!payslips) return [];
    const names = new Set<string>();
    payslips.forEach(ps => names.add(ps.employee_name));
    return Array.from(names).filter(name => 
      name.toLowerCase().includes(deferredSearch.toLowerCase())
    ).slice(0, 50);
  }, [payslips, deferredSearch]);

  const handleBulkSend = () => {
    if (selectedIds.length === 0) return;
    sendEmails({ ids: selectedIds });
    setSelectedIds([]);
  };

  const handleSingleSend = (id: number) => {
    sendEmails({ ids: [id] });
  };

  if (isLoading) return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <HeaderSection count={0} selectedCount={0} viewMode={viewMode} setViewMode={setViewMode} onBulkSend={() => {}} isSending={false} />
      <PayslipSkeleton />
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-['IBM_Plex_Sans_Thai']">
      <HeaderSection 
        count={filteredPayslips.length} 
        selectedCount={selectedIds.length} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onBulkSend={handleBulkSend}
        isSending={isSending}
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-between bg-white rounded-xl h-10 shadow-sm text-xs font-bold">
              <div className="flex items-center gap-2 truncate">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                {selectedEmployee || selectedDept || "ค้นหาพนักงาน หรือ แผนก..."}
              </div>
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 rounded-2xl shadow-xl overflow-hidden" align="start">
            <Command shouldFilter={false}>
              <CommandInput placeholder="พิมพ์เพื่อค้นหา..." value={searchValue} onValueChange={setSearchValue} className="h-11 text-xs font-bold" />
              <CommandList>
                <CommandEmpty className="text-xs p-4 text-slate-400 text-center">ไม่พบข้อมูล</CommandEmpty>
                {(selectedEmployee || selectedDept) && (
                  <CommandGroup>
                    <CommandItem onSelect={() => { setSelectedEmployee(null); setSelectedDept(null); setSearchOpen(false); setSearchValue(""); }} className="text-[10px] font-black text-red-500 uppercase cursor-pointer py-2">ล้างการค้นหาทั้งหมด</CommandItem>
                  </CommandGroup>
                )}
                <CommandGroup heading="รายชื่อแผนก">
                  {departments.map((dept) => (
                    <CommandItem key={dept} onSelect={() => { setSelectedDept(dept); setSelectedEmployee(null); setSearchOpen(false); }} className="text-xs font-bold cursor-pointer">
                      <Check className={cn("mr-2 h-4 w-4 text-sage", selectedDept === dept ? "opacity-100" : "opacity-0")} />{dept}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="รายชื่อพนักงาน">
                  {employeeOptions.map((name) => (
                    <CommandItem key={name} onSelect={() => { setSelectedEmployee(name); setSelectedDept(null); setSearchOpen(false); }} className="text-xs font-bold cursor-pointer">
                      <Check className={cn("mr-2 h-4 w-4 text-sage", selectedEmployee === name ? "opacity-100" : "opacity-0")} />{name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm h-10">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[85px] border-none shadow-none focus:ring-0 h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={(i + 1).toString()}>{new Date(0, i).toLocaleString('th-TH', { month: 'short' })}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm h-10">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={viewCycle} onValueChange={(value) => setViewCycle(value as PaymentCycle | "ALL")}>
            <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ทุกงวด</SelectItem>
              <SelectItem value="1H">งวดที่ 1</SelectItem>
              <SelectItem value="2H">งวดที่ 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm h-10">
          <Send className="h-4 w-4 text-slate-400" />
          <Select value={emailStatus} onValueChange={(v) => setEmailStatus(v as EmailFilterStatus)}>
            <SelectTrigger className="w-[110px] border-none shadow-none focus:ring-0 h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">อีเมลทั้งหมด</SelectItem>
              <SelectItem value="SENT">ส่งแล้ว</SelectItem>
              <SelectItem value="PENDING">ค้างส่ง</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      {paginatedPayslips.length > 0 ? (
        viewMode === 'LIST' ? (
          <ListView 
            data={paginatedPayslips} 
            selectedIds={selectedIds} 
            onToggle={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} 
          />
        ) : (
          <KanbanView data={paginatedPayslips} onSend={handleSingleSend} isSending={isSending} />
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in">
          <FileSpreadsheet className="h-16 w-16 text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold text-sm">ไม่พบข้อมูลใบแจ้งเงินเดือน</p>
        </div>
      )}

      <PaginationControl 
        currentPage={currentPage} 
        totalPages={totalPages} 
        setCurrentPage={setCurrentPage} 
        totalItems={filteredPayslips.length} 
        itemsPerPage={itemsPerPage} 
      />
    </div>
  );
};

export default AdminPayroll;