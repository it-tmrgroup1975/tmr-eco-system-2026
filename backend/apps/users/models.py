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

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

# สมมติว่า Department และ Position อยู่ใน App เดียวกันหรือมีการ import มาแล้ว
# หากยังไม่มี ให้สร้าง Model รองรับ หรือใช้ CharField ไปก่อนตามความเหมาะสมของเฟสพัฒนา

class User(AbstractUser):
    # 1. ใช้ TextChoices เพื่อให้เรียกใช้ใน Code ได้ง่าย (e.g., User.Role.ADMIN)
    class Role(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        SUPERVISOR = 'supervisor', _('Supervisor')
        STAFF = 'staff', _('Staff')

    class EmploymentType(models.TextChoices):
        FULL_TIME = 'full_time', _('พนักงานประจำ')
        CONTRACT = 'contract', _('พนักงานสัญญาจ้าง')
        PART_TIME = 'part_time', _('พนักงานชั่วคราว')

    # 2. Field Definitions
    # แนะนำ: employee_id ไม่ควรเป็น null ในระยะยาว แต่ระบุ null=True ไว้สำหรับข้อมูลเก่าได้
    employee_id = models.CharField(
        max_length=20, 
        unique=True, 
        null=True, 
        blank=True, 
        verbose_name=_("รหัสพนักงาน"),
        help_text=_("ระบุรหัสพนักงาน เช่น EMP001")
    )
    
    role = models.CharField(
        max_length=20, 
        choices=Role.choices,
        default=Role.STAFF,
        verbose_name=_("บทบาท")
    )
    
    employment_type = models.CharField(
        max_length=50,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME,
        verbose_name=_("ประเภทการจ้างงาน")
    )

    # เชื่อมต่อกับ Model อื่น (ตรวจสอบว่าได้สร้าง Model เหล่านี้ไว้แล้ว)
    department = models.ForeignKey(
        'Department', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name=_("แผนก")
    )
    position = models.ForeignKey(
        'Position', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name=_("ตำแหน่ง")
    )
    
    phone_number = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        verbose_name=_("เบอร์โทรศัพท์")
    )
    
    avatar = models.ImageField(
        upload_to='avatars/', 
        null=True, 
        blank=True, 
        verbose_name=_("รูปโปรไฟล์")
    )

    # 3. Properties & Methods
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

    def __str__(self):
        return f"[{self.employee_id or 'N/A'}] {self.full_name}"

    class Meta:
        verbose_name = _("พนักงาน")
        verbose_name_plural = _("ข้อมูลพนักงาน")
        ordering = ['employee_id'] # ช่วยให้การเรียงลำดับในหน้า List ดูง่ายขึ้น