import { Button } from "../../../components/ui/button";
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from "lucide-react";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const PaginationControl = ({ 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  totalItems, 
  itemsPerPage 
}: PaginationControlProps) => (
  totalPages > 1 ? (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/40 shadow-soft-double">
      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
        Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
        <div className="bg-slate-50 px-4 py-1.5 rounded-xl text-xs font-black text-charcoal border border-slate-100">Page {currentPage} / {totalPages}</div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-sage/10" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
      </div>
    </div>
  ) : null
);