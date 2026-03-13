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
    ViewSet สำหรับจัดการข้อมูลพนักงาน (CRUD)
    รองรับ: GET (list/retrieve), POST (create), PUT/PATCH (update), DELETE (destroy)
    """
    queryset = User.objects.all().select_related('department', 'position').order_by('-date_joined')
    serializer_class = EmployeeListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        ปรับปรุง Queryset รองรับการค้นหา (Search) และการกรองตามแผนก (Department Filter)
        """
        queryset = super().get_queryset()
        
        # 1. รับค่าการค้นหา (Search)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(first_name__icontains=search) |
                models.Q(last_name__icontains=search) |
                models.Q(employee_id__icontains=search)
            )
            
        # 2. เพิ่มการกรองตามแผนก (Department Filter)
        # รับค่าชื่อแผนกที่ส่งมาจาก Frontend (activeDept)
        department_name = self.request.query_params.get('department', None)
        if department_name:
            # กรองโดยใช้ชื่อแผนกผ่านความสัมพันธ์ ForeignKey ไปยังโมเดล Department
            queryset = queryset.filter(department__name=department_name)
            
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