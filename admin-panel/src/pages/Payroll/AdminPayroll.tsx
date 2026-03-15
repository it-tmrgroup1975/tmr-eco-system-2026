import { useState, useMemo, useDeferredValue } from "react";
import { usePayroll } from "../../hooks/usePayroll";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { 
  Mail, Loader2, FileSpreadsheet, Filter, Calendar, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Send, Clock, Search, Check, ChevronsUpDown, Users 
} from "lucide-react";
import { ImportPayrollDialog } from "../../components/ImportDialog";
import { Badge } from "../../components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../../components/ui/select";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "../../components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import type { PaymentCycle } from "../../types/payroll";

type EmailFilterStatus = "ALL" | "SENT" | "PENDING";

export const AdminPayroll = () => {
  const { payslips, isLoading, sendEmails, isSending } = usePayroll();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // --- Filter & Search State ---
  const currentMonth = (new Date().getMonth() + 1).toString();
  const [filterMonth, setFilterMonth] = useState<string>(currentMonth);
  const [viewCycle, setViewCycle] = useState<PaymentCycle | "ALL">("ALL");
  const [emailStatus, setEmailStatus] = useState<EmailFilterStatus>("ALL");
  
  // Combobox Search States
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ดึงรายการแผนกที่ไม่ซ้ำกันจากข้อมูล API
  const departments = useMemo(() => {
    if (!payslips) return [];
    const depts = new Set<string>();
    payslips.forEach(ps => { 
      if (ps.employee_department) depts.add(ps.employee_department); 
    });
    return Array.from(depts).sort();
  }, [payslips]);

  // ตัวเลือกพนักงานสำหรับ Combobox (Optimized for performance)
  const employeeOptions = useMemo(() => {
    if (!payslips) return [];
    const names = new Set<string>();
    payslips.forEach(ps => names.add(ps.employee_name));
    return Array.from(names).filter(name => 
      name.toLowerCase().includes(deferredSearch.toLowerCase())
    ).slice(0, 50); // จำกัดการแสดงผลเพื่อความลื่นไหล
  }, [payslips, deferredSearch]);

  // 1. ลอจิกการกรองข้อมูลแบบ Multi-criteria
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

  // 2. ลอจิกการแบ่งหน้า (Pagination)
  const totalPages = Math.ceil(filteredPayslips.length / itemsPerPage);
  const paginatedPayslips = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayslips.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayslips, currentPage]);

  // Reset page เมื่อมีการเปลี่ยน Filter
  useMemo(() => setCurrentPage(1), [filterMonth, viewCycle, emailStatus, selectedEmployee, selectedDept]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkSend = () => {
    if (selectedIds.length === 0) return;
    sendEmails({ ids: selectedIds });
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-sage" /></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-['IBM_Plex_Sans_Thai']">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-charcoal tracking-tight">จัดการส่งใบแจ้งเงินเดือน</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Payroll Management System</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* --- Combobox Search (Employee & Dept) --- */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-[260px] justify-between bg-white border-slate-200 rounded-xl h-10 shadow-sm text-xs font-bold">
                <div className="flex items-center gap-2 truncate text-slate-600">
                  <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {selectedEmployee || selectedDept || "ค้นหาพนักงาน หรือ แผนก..."}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 rounded-2xl shadow-xl border-slate-100 overflow-hidden" align="start">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="พิมพ์เพื่อค้นหา..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-11 text-xs font-bold" 
                />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty className="text-xs p-4 text-slate-400 text-center">ไม่พบข้อมูล</CommandEmpty>
                  
                  {(selectedEmployee || selectedDept) && (
                    <CommandGroup>
                      <CommandItem 
                        onSelect={() => { setSelectedEmployee(null); setSelectedDept(null); setSearchOpen(false); setSearchValue(""); }} 
                        className="text-[10px] font-black text-red-500 uppercase cursor-pointer py-2"
                      >
                        ล้างการค้นหาทั้งหมด
                      </CommandItem>
                    </CommandGroup>
                  )}

                  <CommandGroup heading="รายชื่อแผนก">
                    {departments.map((dept) => (
                      <CommandItem 
                        key={dept} 
                        onSelect={() => { setSelectedDept(dept); setSelectedEmployee(null); setSearchOpen(false); }} 
                        className="text-xs font-bold cursor-pointer"
                      >
                        <Check className={cn("mr-2 h-4 w-4 text-sage", selectedDept === dept ? "opacity-100" : "opacity-0")} />
                        {dept}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandGroup heading="รายชื่อพนักงาน">
                    {employeeOptions.map((name) => (
                      <CommandItem 
                        key={name} 
                        onSelect={() => { setSelectedEmployee(name); setSelectedDept(null); setSearchOpen(false); }} 
                        className="text-xs font-bold cursor-pointer"
                      >
                        <Check className={cn("mr-2 h-4 w-4 text-sage", selectedEmployee === name ? "opacity-100" : "opacity-0")} />
                        {name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Filters: Month, Cycle, Email Status */}
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[85px] border-none shadow-none focus:ring-0 h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (<SelectItem key={i + 1} value={(i + 1).toString()}>{new Date(0, i).toLocaleString('th-TH', { month: 'short' })}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
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

          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
            <Send className="h-4 w-4 text-slate-400" />
            <Select value={emailStatus} onValueChange={(value) => setEmailStatus(value as EmailFilterStatus)}>
              <SelectTrigger className="w-[125px] border-none shadow-none focus:ring-0 h-8 text-xs font-bold">
                <SelectValue placeholder="สถานะอีเมล" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">อีเมลทั้งหมด</SelectItem>
                <SelectItem value="SENT">ส่งสำเร็จแล้ว</SelectItem>
                <SelectItem value="PENDING">ยังไม่ได้รับเมล</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ImportPayrollDialog />

          <Button
            className="bg-sage hover:bg-sage-700 text-white rounded-xl h-10 px-5 shadow-lg shadow-sage/20 transition-all active:scale-95"
            disabled={selectedIds.length === 0 || isSending} onClick={handleBulkSend}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
            ส่งเมล ({selectedIds.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-3 mb-6">
        {paginatedPayslips.length > 0 ? (
          paginatedPayslips.map((ps) => (
            <Card key={ps.id} className={cn(
              "group transition-all border-none rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-md",
              selectedIds.includes(ps.id) && "ring-2 ring-sage bg-sage/5"
            )}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ps.id)}
                    onChange={() => toggleSelect(ps.id)}
                    className="h-5 w-5 rounded-md border-slate-300 text-sage transition-all cursor-pointer"
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">
                      {ps.employee_name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-charcoal text-sm group-hover:text-sage transition-colors">{ps.employee_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-slate-200">
                           <Users className="h-3 w-3 mr-1" /> {ps.employee_department || 'ไม่ระบุแผนก'}
                        </Badge>
                        <Badge className={cn(
                          "text-[9px] px-2 h-4 border-none font-black rounded-md",
                          ps.cycle === '1H' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        )}>
                          {ps.cycle === '1H' ? 'CYCLE 1' : 'CYCLE 2'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-charcoal text-base">฿{Number(ps.net_salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] font-black uppercase">
                    {ps.is_email_sent
                      ? <span className="text-emerald-500 flex items-center gap-1"><Send className="h-3 w-3" /> Sent Success</span>
                      : <span className="text-amber-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Ready</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in">
            <FileSpreadsheet className="h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-sm">ไม่พบข้อมูลใบแจ้งเงินเดือน</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/40 shadow-soft-double">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredPayslips.length)} of {filteredPayslips.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="bg-slate-50 px-4 py-1.5 rounded-xl text-xs font-black text-charcoal border border-slate-100">
               Page {currentPage} / {totalPages}
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};