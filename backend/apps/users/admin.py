from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Department, Position

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('name', 'code')

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_department')
    list_filter = ('department',)

    @admin.display(ordering='department__name', description='Department')
    def get_department(self, obj):
        return obj.department.name

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # กำหนดฟิลด์ที่จะแสดงในหน้า List
    list_display = ('employee_id', 'username', 'first_name', 'last_name', 'department', 'role', 'is_staff')
    list_filter = ('role', 'department', 'employment_type', 'is_staff')
    
    # เพิ่มฟิลด์ที่เราสร้างใหม่เข้าไปในหน้าแก้ไข (Fieldsets)
    fieldsets = UserAdmin.fieldsets + (
        ('ข้อมูลพนักงาน (ERP)', {'fields': (
            'employee_id', 
            'role', 
            'department', 
            'position', 
            'phone_number', 
            'id_card_number',
            'employment_type',
            'avatar'
        )}),
    )
    
    # ฟิลด์สำหรับหน้าสร้าง User ใหม่
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('ข้อมูลพนักงาน (ERP)', {'fields': (
            'employee_id', 
            'role', 
            'department', 
            'position', 
            'employment_type'
        )}),
    )