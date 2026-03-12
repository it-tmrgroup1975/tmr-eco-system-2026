from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'  # เพราะเราเพิ่ม sys.path เข้าไปที่ backend/apps แล้วใน settings.py
    verbose_name = 'การจัดการพนักงาน'