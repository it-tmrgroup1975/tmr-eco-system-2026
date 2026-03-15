import io
import pandas as pd
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import Payslip
from .serializers import PayslipSerializer
from .services import PayslipEmailService, PayslipPDFService
from .import_service import PayrollImportService
import logging

logger = logging.getLogger(__name__)

class AdminPayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    parser_classes = (MultiPartParser, FormParser) # รองรับการรับไฟล์ผ่าน Action ต่างๆ
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """แยกสิทธิ์การเข้าถึงข้อมูลตามบทบาทของผู้ใช้"""
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Payslip.objects.all()
        return Payslip.objects.filter(employee=user)

    @action(detail=False, methods=['get'], url_path='my-payslips')
    def my_payslips(self, request):
        """Endpoint สำหรับพนักงานดึงสลิปของตนเอง"""
        queryset = self.get_queryset().filter(employee=request.user).order_by('-period_year', '-period_month', '-cycle')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='bulk-send')
    def bulk_send(self, request):
        """ส่งอีเมลแจ้งเงินเดือนแบบกลุ่ม"""
        payslip_ids = request.data.get('ids', [])
        payslips = Payslip.objects.filter(id__in=payslip_ids)
        
        success_count = 0
        for ps in payslips:
            if ps.employee.email and PayslipEmailService.send_individual_email(ps):
                success_count += 1
                
        return Response({
            "success": True,
            "message": f"ส่งอีเมลสำเร็จ {success_count} จาก {payslips.count()} รายการ",
            "sent_count": success_count
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='import-excel')
    def import_excel(self, request):
        """Endpoint เดียวสำหรับการนำเข้าข้อมูล (แทนที่ PayrollImportView เดิม)"""
        file_obj = request.FILES.get('file')
        month = request.data.get('month')
        year = request.data.get('year')
        cycle = request.data.get('cycle') # รับ '1H' หรือ '2H'

        if not all([file_obj, month, year, cycle]):
            return Response(
                {"error": "กรุณาระบุข้อมูลให้ครบถ้วน (ไฟล์, เดือน, ปี, งวดการจ่าย)"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            success, errors = PayrollImportService.process_excel(
                file_obj, int(month), int(year), cycle
            )
            return Response({
                "message": f"นำเข้าข้อมูลสำเร็จ {success} รายการ",
                "errors": errors
            }, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='download-template')
    def download_template(self, request):
        """สร้างไฟล์ Excel Template สำหรับ Bi-monthly Payroll"""
        headers = ['รหัสพนักงาน', 'Hours Rate', 'Attendance', 'Other Income']
        # ตัวอย่างข้อมูล (ไม่ต้องระบุ Tax/SSO เพราะ Service คำนวณให้)
        example_data = [['EMP001', 100.00, 160.0, 0.00]]
        df = pd.DataFrame(example_data, columns=headers)
        
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='PayrollTemplate')
        
        output.seek(0)
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=payroll_import_template.xlsx'
        return response
    
    @action(detail=True, methods=['get'], url_path='download-pdf')
    def download_pdf(self, request, pk=None):
        """Endpoint สำหรับดาวน์โหลดใบแจ้งเงินเดือนเป็น PDF"""
        payslip = self.get_object()
        try:
            # เรียกใช้ Service เพื่อสร้าง PDF Bytes
            pdf_bytes = PayslipPDFService.generate_pdf_bytes(payslip)
            
            filename = f"Payslip_{payslip.employee.employee_id}_{payslip.period_month}_{payslip.period_year}.pdf"
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except Exception as e:
            # พิมพ์รายละเอียด Error ลงใน Console ของ Django เพื่อการ Debug
            import traceback
            print("--- PDF Generation Error Details ---")
            print(traceback.format_exc()) 
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )