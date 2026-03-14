from django.apps import AppConfig

class AttendanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    # หากคุณแก้ sys.path ใน manage.py แล้ว ให้ใช้แค่ 'attendance'
    # หากไม่ได้แก้ ให้ใช้ 'apps.attendance'
    name = 'attendance'