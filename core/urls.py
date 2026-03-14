# core/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# แนะนำ: Import เฉพาะ ViewSet เพื่อความเป็นระเบียบ
from users.views import (
    LoginView, 
    EmployeeViewSet, 
    DepartmentViewSet, 
    PositionViewSet
)

# 1. การลงทะเบียน Router (ถูกต้องแล้ว)
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions', PositionViewSet, basename='position')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 2. Authentication Endpoints
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 3. API Endpoints (รวมถึง @action ต่างๆ เช่น /download-template/)
    path('api/', include(router.urls)),
] 

# 4. Media Files Service (ช่วง Development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)