from rest_framework import serializers
from .models import Payslip

class PayslipSerializer(serializers.ModelSerializer):
    # ดึงชื่อพนักงานมาแสดงแทนที่จะเห็นแค่ ID
    employee_name = serializers.ReadOnlyField(source='employee.get_full_name')
    # ดึงค่า net_salary จาก @property ใน Model
    net_salary = serializers.ReadOnlyField()

    class Meta:
        model = Payslip
        fields = [
            'id', 'employee', 'employee_name', 'period_month', 'period_year', 
            'hours_rate', 'attendance_hours', 'salary_amount', 
            'tax_deduction', 'social_security', 'net_salary', 
            'is_email_sent', 'last_sent_at'
        ]