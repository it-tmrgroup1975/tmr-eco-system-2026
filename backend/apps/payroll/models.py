from django.db import models
from django.conf import settings

class Payslip(models.Model):
    # เชื่อมโยงกับพนักงาน
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='payslips'
    )
    
    # ข้อมูลเวลาและรายได้
    period_month = models.IntegerField() # 1-12
    period_year = models.IntegerField()  # 2024
    hours_rate = models.DecimalField(max_digits=10, decimal_places=2)
    attendance_hours = models.DecimalField(max_digits=10, decimal_places=2)
    
    # คำนวณเบื้องต้น
    salary_amount = models.DecimalField(max_digits=10, decimal_places=2) # Gross
    tax_deduction = models.DecimalField(max_digits=10, decimal_places=2)
    social_security = models.DecimalField(max_digits=10, decimal_places=2)
    
    # สถานะการส่งอีเมล
    is_email_sent = models.BooleanField(default=False)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    
    @property
    def net_salary(self):
        return self.salary_amount - self.tax_deduction - self.social_security

    class Meta:
        unique_together = ('employee', 'period_month', 'period_year') # ห้ามออกซ้ำเดือนเดิม