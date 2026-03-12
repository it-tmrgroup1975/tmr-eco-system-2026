// src/pages/Dashboard/components/IncidentWidget.tsx
import { useState } from "react";
import { AlertTriangle, Camera, X, Send, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

export function IncidentWidget() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return toast.error("กรุณาระบุรายละเอียดเหตุการณ์");
    
    // Logic ส่งข้อมูล API...
    toast.success("ส่งรายงานเรียบร้อยแล้ว ทีมงานกำลังตรวจสอบ");
    setDescription("");
    setImage(null);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-soft-double h-full flex flex-col">
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <AlertTriangle size={20} className="animate-pulse" />
        <h3 className="font-bold text-charcoal">รายงานเหตุการณ์ด่วน</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="แจ้งปัญหาที่พบ หรืออุบัติเหตุในพื้นที่..."
          className="w-full flex-1 p-4 rounded-2xl bg-[#F1F5F9]/50 border border-white/40 focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none resize-none text-sm text-charcoal placeholder:text-charcoal/30 transition-all"
        />

        <div className="flex items-center gap-4">
          {!image ? (
            <label className="flex-1 h-14 border-2 border-dashed border-charcoal/10 rounded-2xl flex items-center justify-center gap-2 text-charcoal/40 hover:bg-sage/5 hover:border-sage/30 cursor-pointer transition-all">
              <Camera size={20} />
              <span className="text-xs font-medium">แนบรูปถ่ายหลักฐาน</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative h-14 w-14 group">
              <img src={image} className="h-full w-full object-cover rounded-xl shadow-md" alt="preview" />
              <button 
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={10} />
              </button>
            </div>
          )}

          <Button 
            type="submit" 
            className={cn(
              "h-14 px-8 rounded-2xl font-bold gap-2 shadow-lg transition-all",
              description ? "bg-charcoal text-white shadow-charcoal/20" : "bg-charcoal/10 text-charcoal/40"
            )}
          >
            <Send size={18} />
            ส่งข้อมูล
          </Button>
        </div>
      </form>
    </div>
  );
}

// Helper function สำหรับรวมคลาส
import { cn } from "../../../lib/utils";