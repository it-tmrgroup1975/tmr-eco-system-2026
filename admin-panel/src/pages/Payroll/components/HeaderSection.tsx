import { 
  LayoutList, LayoutGrid, Loader2, Mail, Sparkles 
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ImportPayrollDialog } from "../../../components/ImportDialog";

type ViewMode = "LIST" | "KANBAN";

interface HeaderSectionProps {
  count: number;
  selectedCount: number;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  onBulkSend: () => void;
  isSending: boolean;
}

export const HeaderSection = ({ 
  count, 
  selectedCount, 
  viewMode, 
  setViewMode, 
  onBulkSend, 
  isSending 
}: HeaderSectionProps) => (
  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-black text-[#2D3748] tracking-tight flex items-center gap-2">
        จัดการส่งใบแจ้งเงินเดือน <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
      </h1>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
        Found {count} Records | Selected {selectedCount}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm mr-2">
        <Button 
          variant={viewMode === 'LIST' ? 'secondary' : 'ghost'} 
          size="sm" 
          onClick={() => setViewMode('LIST')}
          className="rounded-lg h-8 w-10 p-0"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
        <Button 
          variant={viewMode === 'KANBAN' ? 'secondary' : 'ghost'} 
          size="sm" 
          onClick={() => setViewMode('KANBAN')}
          className="rounded-lg h-8 w-10 p-0"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      <ImportPayrollDialog />

      <Button
        className="bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-xl h-10 px-5 shadow-lg shadow-sage/20 transition-all active:scale-95"
        disabled={selectedCount === 0 || isSending} 
        onClick={onBulkSend}
      >
        {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
        ส่งเมลที่เลือก ({selectedCount})
      </Button>
    </div>
  </div>
);