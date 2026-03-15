# backend/apps/payroll/serializers.py
from rest_framework import serializers
from .models import Payslip

class PayslipSerializer(serializers.ModelSerializer):
    # ใช้ ReadOnlyField ร่วมกับ select_related ใน View จะเร็วกว่า SerializerMethodField
    employee_name = serializers.ReadOnlyField(source='employee.get_full_name')
    # ดึงชื่อแผนกโดยตรงผ่าน Relationship (แนะนำให้ทำ select_related('employee__department') ใน View)
    employee_department = serializers.ReadOnlyField(source='employee.department.name', default="ไม่ระบุแผนก")
    net_salary = serializers.ReadOnlyField()

    class Meta:
        model = Payslip
        fields = [
            'id', 'employee', 'employee_name', 'employee_department',
            'period_month', 'period_year', 'cycle', 'hours_rate', 
            'attendance_hours', 'salary_amount', 'tax_deduction', 
            'social_security', 'net_salary', 'is_email_sent', 'last_sent_at'
        ]