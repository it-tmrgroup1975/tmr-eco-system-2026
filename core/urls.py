# core/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

# Import เดิมของคุณ
from users.views import (
    LoginView, 
    EmployeeViewSet, 
    DepartmentViewSet, 
    PositionViewSet
)
from attendance.views import AttendanceViewSet
from payroll.views import AdminPayslipViewSet

# --- 1. การลงทะเบียน Router ---
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions', PositionViewSet, basename='position')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'admin-payslips', AdminPayslipViewSet, basename='admin-payslips')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 2. Authentication Endpoints
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 3. API Endpoints
    path('api/', include(router.urls)), # Endpoints ของ users และ attendance
] 

# 4. Media Files Service (ช่วง Development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)