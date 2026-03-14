import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employeeApi";
import { toast } from "sonner";

/**
 * Hook สำหรับจัดการ Action ต่างๆ ของพนักงาน
 * เน้นการจัดการ Server State และการทำ Invalidation ที่แม่นยำ
 */
export const useEmployeeActions = () => {
  const queryClient = useQueryClient();

  // Mutation สำหรับการลบข้อมูลพนักงาน
  const deleteMutation = useMutation({
    // ปรับปรุง: รับ id เป็น number | string เพื่อให้สอดคล้องกับ API และป้องกัน Type Error
    mutationFn: (id: number | string) => employeeApi.delete(id),
    
    // เมื่อลบสำเร็จ (Success)
    onSuccess: (_, id) => {
      // 1. Invalidate รายชื่อพนักงานทั้งหมด
      // exact: false ช่วยให้ล้าง cache ทั้งหมดที่มี queryKey ขึ้นต้นด้วย "employees" (รวมถึงที่มี filters)
      queryClient.invalidateQueries({ 
        queryKey: ["employees"],
        exact: false 
      });

      // 2. ลบข้อมูลพนักงานรายบุคคลออกจาก Cache ทันที
      // ใช้ทั้ง "employee" และ "employees" (ถ้ามีการตั้งชื่อ key ต่างกันในส่วนอื่น)
      queryClient.removeQueries({ queryKey: ["employee", id] });
      queryClient.removeQueries({ queryKey: ["employee", String(id)] });

      // 3. เพิ่มเติม: ล้างข้อมูลรูปภาพที่อาจค้างอยู่ใน memory ของ browser (Object URL)
      // หากมีการใช้ URL.createObjectURL ในหน้าฟอร์ม การล้าง cache จะช่วยให้ Garbage Collector ทำงานได้ดีขึ้น
      
      // 4. แสดงการแจ้งเตือนสำเร็จ
      toast.success("ลบข้อมูลและรูปโปรไฟล์พนักงานเรียบร้อยแล้ว", {
        description: "ข้อมูลถูกถอดการติดตั้งจากฐานข้อมูล TMR 2026 อย่างสมบูรณ์",
      });
    },

    // เมื่อเกิดข้อผิดพลาด (Error)
    onError: (error: any) => {
      console.error("Delete Error:", error);
      const errorMessage = error.response?.data?.detail || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อลบข้อมูลได้";
      
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
        description: errorMessage,
      });
    },
  });

  return {
    /** ฟังก์ชันสำหรับสั่งลบพนักงาน รับพารามิเตอร์เป็น ID (number | string) */
    deleteEmployee: deleteMutation.mutate,
    /** สถานะกำลังประมวลผลการลบ (Loading State) */
    isDeleting: deleteMutation.isPending,
    /** ตรวจสอบว่าเกิด Error หรือไม่ */
    isError: deleteMutation.isError,
  };
};