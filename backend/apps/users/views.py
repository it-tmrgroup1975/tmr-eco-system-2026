from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db import models
from .models import Department, Position, User
from .serializers import (
    CustomTokenObtainPairSerializer,
    EmployeeListSerializer,
    DepartmentSerializer,
    PositionSerializer
)
from django.http import HttpResponse
from django.utils.timezone import now
import pandas as pd
from rest_framework.pagination import PageNumberPagination

User = get_user_model()

# --- Authentication View ---

class LoginView(TokenObtainPairView):
    """
    View สำหรับการ Login เพื่อรับ Access และ Refresh Token
    พร้อมข้อมูล Profile เบื้องต้น
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# กำหนด Class สำหรับการจัดการ Pagination ที่เป็นมาตรฐานของระบบ
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12  # จำนวนต่อหน้า (Kanban มักใช้เลขที่หารด้วย 2, 3, 4 ลงตัว)
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- Employee Management ViewSet ---

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet สำหรับจัดการข้อมูลพนักงาน (CRUD) พร้อมระบบกรองข้อมูลอัจฉริยะ
    รองรับการกรองหลายเงื่อนไขพร้อมกัน (Multiple Filters)
    """
    queryset = User.objects.all().select_related('department', 'position').order_by('-date_joined')
    serializer_class = EmployeeListSerializer
    permission_classes = [IsAuthenticated]

    # เปิดใช้งาน Pagination ใน ViewSet
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        """
        ปรับปรุง Queryset เพื่อรองรับ Search, Department, Position, 
        Employment Type และ Date Range Filtering
        """
        queryset = super().get_queryset()
        params = self.request.query_params
        
        # 1. ระบบ Search (ชื่อจริง, นามสกุล, หรือรหัสพนักงาน)
        search = params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(employee_id__icontains=search)
            )
            
        # 2. กรองตามแผนก (รองรับทั้ง ID หรือ ชื่อแผนก)
        department = params.get('department', None)
        if department and department not in ["all", "ทั้งหมด"]:
            if department.isdigit():
                queryset = queryset.filter(department_id=department)
            else:
                queryset = queryset.filter(department__name=department)
        
        # 3. กรองตามตำแหน่งงาน (Position ID)
        position = params.get('position', None)
        if position:
            queryset = queryset.filter(position_id=position)
            
        # 4. กรองตามประเภทการจ้างงาน (เช่น full_time, contract, part_time)
        employment_type = params.get('employment_type', None)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)

        # 5. กรองตามช่วงวันที่เข้างาน (Date Range Filtering)
        # รับค่าวันที่จาก Query Params ในรูปแบบ YYYY-MM-DD
        start_date = params.get('start_date', None)
        end_date = params.get('end_date', None)
        
        if start_date:
            # กรองพนักงานที่เข้างานตั้งแต่วันที่กำหนดเป็นต้นไป
            queryset = queryset.filter(date_joined__date__gte=start_date)
            
        if end_date:
            # กรองพนักงานที่เข้างานไม่เกินวันที่กำหนด
            queryset = queryset.filter(date_joined__date__lte=end_date)
            
        return queryset

    @action(detail=False, methods=['get'], url_path='export-excel')
    def export_excel(self, request):
        """ส่งออกข้อมูลพนักงานตาม Filter ที่เลือก"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # เตรียมข้อมูลสำหรับ DataFrame
        data = []
        for emp in queryset:
            data.append({
                'รหัสพนักงาน': emp.employee_id,
                'Username': emp.username,
                'ชื่อ': emp.first_name,
                'นามสกุล': emp.last_name,
                'แผนก': emp.department.name if emp.department else '-',
                'ตำแหน่ง': emp.position.name if emp.position else '-',
                'ประเภทการจ้าง': emp.get_employment_type_display(),
                'บทบาท': emp.role
            })

        df = pd.DataFrame(data)
        
        # สร้าง Response เป็น Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="employees_{now().strftime("%Y%m%d")}.xlsx"'
        
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Employees')
            
        return response

    @action(detail=False, methods=['post'], url_path='import-excel')
    def import_excel(self, request):
        """Bulk Create/Update พนักงานจากไฟล์ Excel"""
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "ไม่พบไฟล์ที่อัปโหลด"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df = pd.read_excel(file)
            import_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    # Logic: ใช้ employee_id เป็น Key ในการ Update หรือ Create
                    dept, _ = Department.objects.get_or_create(name=row['แผนก'])
                    pos, _ = Position.objects.get_or_create(name=row['ตำแหน่ง'], department=dept)
                    
                    User.objects.update_or_create(
                        employee_id=row['รหัสพนักงาน'],
                        defaults={
                            'username': row['Username'],
                            'first_name': row['ชื่อ'],
                            'last_name': row['นามสกุล'],
                            'department': dept,
                            'position': pos,
                            'employment_type': 'full_time', # ควร Map จากข้อมูลจริง
                            'role': row['บทบาท'].lower() if row['บทบาท'] else 'staff'
                        }
                    )
                    import_count += 1
                except Exception as e:
                    errors.append(f"แถวที่ {index+2}: {str(e)}")

            return Response({
                "message": f"นำเข้าข้อมูลสำเร็จ {import_count} รายการ",
                "errors": errors
            }, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS)

        except Exception as e:
            return Response({"error": f"เกิดข้อผิดพลาดในการอ่านไฟล์: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

# --- Support Data ViewSets (สำหรับ Dropdown ใน Frontend) ---

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class PositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]