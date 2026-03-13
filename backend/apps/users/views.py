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

User = get_user_model()

# --- Authentication View ---

class LoginView(TokenObtainPairView):
    """
    View สำหรับการ Login เพื่อรับ Access และ Refresh Token
    พร้อมข้อมูล Profile เบื้องต้น
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# --- Employee Management ViewSet ---

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet สำหรับจัดการข้อมูลพนักงาน (CRUD) พร้อมระบบกรองข้อมูลอัจฉริยะ
    รองรับการกรองหลายเงื่อนไขพร้อมกัน (Multiple Filters)
    """
    queryset = User.objects.all().select_related('department', 'position').order_by('-date_joined')
    serializer_class = EmployeeListSerializer
    permission_classes = [IsAuthenticated]

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

# --- Support Data ViewSets (สำหรับ Dropdown ใน Frontend) ---

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class PositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]