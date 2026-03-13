from django.db import models
from django.contrib.auth.models import AbstractUser

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="ชื่อแผนก")
    code = models.CharField(max_length=10, unique=True, verbose_name="รหัสแผนก")

    class Meta:
        verbose_name = "แผนก"
        verbose_name_plural = "ข้อมูลแผนก"

    def __str__(self):
        return self.name

class Position(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="ชื่อตำแหน่ง")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions')

    class Meta:
        verbose_name = "ตำแหน่ง"
        verbose_name_plural = "ข้อมูลตำแหน่ง"

    def __str__(self):
        return f"{self.name} ({self.department.name})"

class User(AbstractUser):
    employee_id = models.CharField(max_length=20, unique=True, null=True, blank=True, verbose_name="รหัสพนักงาน")
    role = models.CharField(
        max_length=20, 
        choices=[('admin', 'Admin'), ('supervisor', 'Supervisor'), ('staff', 'Staff')],
        default='staff'
    )
    employment_type = models.CharField(
        max_length=50,
        choices=[('full_time', 'พนักงานประจำ'), ('contract', 'พนักงานสัญญาจ้าง'), ('part_time', 'พนักงานชั่วคราว')],
        default='full_time',
        verbose_name="ประเภทการจ้างงาน"
    )
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    avatar = models.ImageField(
        upload_to='avatars/', 
        null=True, 
        blank=True, 
        verbose_name="รูปโปรไฟล์"
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        # ลบ db_table = 'auth_user' ออก
        verbose_name = "พนักงาน"
        verbose_name_plural = "ข้อมูลพนักงาน"