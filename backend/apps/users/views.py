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
    """
    queryset = User.objects.all().select_related('department', 'position').order_by('-date_joined')
    serializer_class = EmployeeListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. ระบบ Search (ชื่อ, นามสกุล, รหัสพนักงาน)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(employee_id__icontains=search)
            )
            
        # 2. กรองตามแผนก (Smart Filter: รองรับทั้งชื่อแผนก หรือ ID)
        department = self.request.query_params.get('department', None)
        if department and department != "ทั้งหมด":
            if department.isdigit():
                queryset = queryset.filter(department_id=department)
            else:
                queryset = queryset.filter(department__name=department)
        
        # 3. Advanced Filters (ตำแหน่ง และ ประเภทการจ้างงาน)
        position = self.request.query_params.get('position', None)
        employment_type = self.request.query_params.get('employment_type', None)
        
        if position:
            queryset = queryset.filter(position_id=position)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
            
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