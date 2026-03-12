import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function SearchBar() {
  return (
    <div className="flex gap-4 items-center w-full max-w-4xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
        <Input 
          placeholder="ค้นหาพนักงานด้วยรหัส, ชื่อ หรือแผนก..." 
          className="pl-10 h-12 bg-white border-none shadow-sm rounded-xl focus-visible:ring-sage"
        />
      </div>
      <Button variant="outline" className="h-12 px-6 rounded-xl border-none bg-white shadow-sm hover:bg-sage/10 text-charcoal">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        กรองข้อมูล
      </Button>
    </div>
  );
}