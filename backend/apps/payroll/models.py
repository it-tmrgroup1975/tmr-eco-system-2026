from django.db import models
from django.conf import settings


class PaymentCycle(models.TextChoices):
    FIRST_HALF = '1H', 'รอบวันที่ 1-15 (ต้นเดือน)'
    SECOND_HALF = '2H', 'รอบวันที่ 16-สิ้นเดือน (ปลายเดือน)'


class Payslip(models.Model):
    # กำหนดตัวเลือกงวดการจ่าย
    class PaymentCycle(models.TextChoices):
        FIRST_HALF = '1H', 'งวดที่ 1 (ต้นเดือน)'
        SECOND_HALF = '2H', 'งวดที่ 2 (สิ้นเดือน)'

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='payslips'
    )
    
    # เพิ่ม cycle เพื่อแยกงวด
    cycle = models.CharField(
        max_length=2, 
        choices=PaymentCycle.choices, 
        default=PaymentCycle.SECOND_HALF
    )
    period_month = models.IntegerField() 
    period_year = models.IntegerField()  
    
    hours_rate = models.DecimalField(max_digits=10, decimal_places=2)
    attendance_hours = models.DecimalField(max_digits=10, decimal_places=2)
    
    salary_amount = models.DecimalField(max_digits=10, decimal_places=2) 
    tax_deduction = models.DecimalField(max_digits=10, decimal_places=2)
    social_security = models.DecimalField(max_digits=10, decimal_places=2)
    
    is_email_sent = models.BooleanField(default=False)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    
    @property
    def net_salary(self):
        # คำนวณยอดสุทธิโดยหักภาษีและประกันสังคม
        return self.salary_amount - self.tax_deduction - self.social_security

    class Meta:
        # ปรับให้ห้ามออกซ้ำใน "พนักงาน + ปี + เดือน + งวด" เดียวกัน
        unique_together = ('employee', 'period_month', 'period_year', 'cycle')