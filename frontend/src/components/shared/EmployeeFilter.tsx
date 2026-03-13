// frontend/src/components/shared/EmployeeFilter.tsx
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  return (
    <div className="flex gap-4 items-center w-full max-w-4xl font-thai">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2D3748]/40" />
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ค้นหาพนักงานด้วยรหัส, ชื่อ หรือแผนก..." 
          className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl focus-visible:ring-[#4A7C59] transition-all"
        />
      </div>
      <Button 
        variant="outline" 
        onClick={onFilterClick}
        className="h-12 px-6 rounded-xl border-none bg-white shadow-sm hover:bg-[#4A7C59]/10 text-[#2D3748] font-bold"
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        กรองข้อมูล
      </Button>
    </div>
  );
}