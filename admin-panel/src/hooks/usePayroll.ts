import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollApi } from "../api/payrollApi";
import { toast } from "sonner";

export const usePayroll = () => {
  const queryClient = useQueryClient();

  // Hook สำหรับดึงข้อมูล
  const { data: payslips, isLoading } = useQuery({
    queryKey: ["payslips"],
    queryFn: payrollApi.getAllPayslips,
  });

  // Hook สำหรับส่งอีเมล
  const bulkEmailMutation = useMutation({
    mutationFn: payrollApi.sendBulkEmails,
    onSuccess: (data) => {
      toast.success(data.message);
      // Refresh ข้อมูลในตารางเพื่ออัปเดตสถานะ is_email_sent
      queryClient.invalidateQueries({ queryKey: ["payslips"] });
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาดในการส่งอีเมล");
    }
  });

  return {
    payslips,
    isLoading,
    sendEmails: bulkEmailMutation.mutate,
    isSending: bulkEmailMutation.isPending
  };
};