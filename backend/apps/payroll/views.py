import io
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payslip
from .serializers import PayslipSerializer  # เพิ่มการ Import Serializer
from .services import PayslipEmailService
from .import_service import PayrollImportService
import pandas as pd
from django.http import HttpResponse

class AdminPayslipViewSet(viewsets.ModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer  # แก้ไข: เพิ่มบรรทัดนี้เพื่อแก้ AssertionError

    def get_queryset(self):
        """
        ถ้าเป็น Admin ให้เห็นทั้งหมด 
        ถ้าเป็นพนักงานทั่วไป ให้เห็นเฉพาะของตัวเอง
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Payslip.objects.all()
        return Payslip.objects.filter(employee=user)

    @action(detail=False, methods=['get'], url_path='my-payslips')
    def my_payslips(self, request):
        """ส่งคืนสลิปเฉพาะของพนักงานที่ล็อกอินอยู่"""
        queryset = self.get_queryset().filter(employee=request.user).order_by('-period_year', '-period_month')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='bulk-send')
    def bulk_send(self, request):
        payslip_ids = request.data.get('ids', [])
        payslips = Payslip.objects.filter(id__in=payslip_ids)
        
        success_count = 0
        for ps in payslips:
            # ตรวจสอบว่ามีอีเมลพนักงานก่อนส่ง
            if ps.employee.email and PayslipEmailService.send_individual_email(ps):
                success_count += 1
                
        return Response({
            "success": True,
            "message": f"ส่งอีเมลสำเร็จ {success_count} จาก {payslips.count()} รายการ",
            "sent_count": success_count
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='import-excel')
    def import_excel(self, request):
        file = request.FILES.get('file')
        month = request.data.get('month')
        year = request.data.get('year')

        if not file:
            return Response({"error": "กรุณาแนบไฟล์"}, status=400)

        success, errors = PayrollImportService.process_excel(file, month, year)
        
        return Response({
            "message": f"นำเข้าสำเร็จ {success} รายการ",
            "errors": errors
        }, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS)
    
    @action(detail=False, methods=['get'], url_path='download-template')
    def download_template(self, request): # เพิ่มพารามิเตอร์ request เข้าไปที่นี่
        """
        สร้างและส่งไฟล์ Excel Template สำหรับการนำเข้าข้อมูลเงินเดือน
        """
        # 1. กำหนดหัวตาราง (Headers)
        headers = [
            'รหัสพนักงาน', 
            'Hours Rate', 
            'Attendance', 
            'Salary Amount', 
            'Tax', 
            'SSO'
        ]
        
        # 2. สร้าง DataFrame เปล่าๆ พร้อมตัวอย่างข้อมูล
        example_data = [
            ['EMP001', 100.00, 160.0, 16000.00, 500.00, 750.00]
        ]
        df = pd.DataFrame(example_data, columns=headers)
        
        # 3. เขียนข้อมูลลงใน Memory Buffer
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='PayrollTemplate')
        
        # 4. ตั้งค่า Response
        output.seek(0)
        filename = "payroll_import_template.xlsx"
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename={filename}'
        
        return response