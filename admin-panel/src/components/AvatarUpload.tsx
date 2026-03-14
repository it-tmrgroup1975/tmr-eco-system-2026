// frontend/src/pages/Employees/components/AvatarSection.tsx
import { Camera, X } from "lucide-react";
import { cn } from "../lib/utils";

interface AvatarSectionProps {
  previewUrl: string | null;
  isViewMode: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (e: React.MouseEvent) => void;
}

export const AvatarSection = ({ previewUrl, isViewMode, fileInputRef, onFileChange, onRemove }: AvatarSectionProps) => (
  <div className="flex flex-col items-center justify-center space-y-3 pb-4">
    <div className="relative group">
      <div
        onClick={() => !isViewMode && fileInputRef.current?.click()}
        className={cn(
          "w-28 h-28 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all shadow-inner",
          isViewMode ? "border-[#4A7C59]/10 bg-slate-50" : "cursor-pointer border-[#4A7C59]/20 bg-[#4A7C59]/5 hover:border-[#4A7C59]/50 hover:bg-[#4A7C59]/10"
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-[#4A7C59]/40">
            <Camera size={28} />
            <span className="text-[10px] font-black mt-1 tracking-widest uppercase">Photo</span>
          </div>
        )}
      </div>
      {previewUrl && !isViewMode && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg"
        >
          <X size={12} />
        </button>
      )}
    </div>
    <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
    <p className="text-[11px] font-bold text-[#2D3748]/40 uppercase">
      {isViewMode ? "โปรไฟล์บุคลากร (Read Only)" : "รูปภาพประจำตัว (JPG/PNG)"}
    </p>
  </div>
);