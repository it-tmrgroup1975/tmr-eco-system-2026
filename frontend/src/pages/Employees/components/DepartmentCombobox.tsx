// frontend/src/pages/Employees/components/DepartmentCombobox.tsx
import * as React from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import type { Department } from "../../../types/employee";

interface Props {
  departments: Department[];
  activeDept: string;
  onDeptChange: (id: string) => void;
}

export function DepartmentCombobox({ departments, activeDept, onDeptChange }: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedDept = departments.find((d) => String(d.id) === activeDept);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-16 justify-between rounded-2xl border-none bg-white/60 backdrop-blur-md px-6 min-w-[240px] shadow-sm hover:bg-white/80 transition-all font-thai"
        >
          <div className="flex items-center gap-3">
            <Building2 size={20} className={activeDept !== "all" ? "text-[#4A7C59]" : "text-[#2D3748]/30"} />
            <span className={cn("font-bold text-lg", activeDept === "all" ? "text-[#2D3748]/40" : "text-[#2D3748]")}>
              {activeDept === "all" ? "ทุกแผนก" : selectedDept?.name}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 rounded-2xl border-white/40 shadow-xl overflow-hidden font-thai">
        <Command>
          <CommandInput placeholder="ค้นหาชื่อแผนก..." className="h-12" />
          <CommandList>
            <CommandEmpty>ไม่พบชื่อแผนก</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onDeptChange("all");
                  setOpen(false);
                }}
                className="h-12 cursor-pointer"
              >
                <Check className={cn("mr-2 h-4 w-4", activeDept === "all" ? "opacity-100" : "opacity-0")} />
                แสดงพนักงานทั้งหมด
              </CommandItem>
              {departments.map((dept) => (
                <CommandItem
                  key={dept.id}
                  value={dept.name}
                  onSelect={() => {
                    onDeptChange(String(dept.id));
                    setOpen(false);
                  }}
                  className="h-12 cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", activeDept === String(dept.id) ? "opacity-100" : "opacity-0")} />
                  {dept.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}