// frontend/src/hooks/useEmployeeActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employeeApi";
import { toast } from "sonner"; // หรือใช้ toast จาก shadcn

export const useEmployeeActions = () => {
  const queryClient = useQueryClient();

  // Mutation สำหรับการลบ
  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("ลบข้อมูลพนักงานเรียบร้อยแล้ว");
    },
    onError: () => toast.error("ไม่สามารถลบข้อมูลได้"),
  });

  return {
    deleteEmployee: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};