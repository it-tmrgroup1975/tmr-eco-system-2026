# core/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# แก้ไขตรงนี้: ตัด 'apps.' ออก
from users.views import (
    LoginView, 
    EmployeeViewSet, 
    DepartmentViewSet, 
    PositionViewSet
)

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions', PositionViewSet, basename='position')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
] 

# เพิ่มบรรทัดนี้เพื่อรับใช้ไฟล์ Media ในช่วง Development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)