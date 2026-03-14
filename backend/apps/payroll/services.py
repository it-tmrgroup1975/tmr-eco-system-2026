from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

class PayslipEmailService:
    @staticmethod
    def send_individual_email(payslip):
        """ส่งเมลรายบุคคล และ Update สถานะ"""
        subject = f"ใบแจ้งเงินเดือน {payslip.period_month}/{payslip.period_year}"
        context = {
            'name': payslip.employee.get_full_name(),
            'period': f"{payslip.period_month}/{payslip.period_year}",
            'net_salary': payslip.net_salary,
            'details': payslip
        }
        
        # ดึง HTML Template (ต้องสร้างใน templates/emails/payslip.html)
        html_body = render_to_string('emails/payslip_template.html', context)
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=f"ยอดเงินเดือนสุทธิ: {payslip.net_salary}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[payslip.employee.email]
        )
        email.attach_alternative(html_body, "text/html")
        
        if email.send():
            payslip.is_email_sent = True
            payslip.last_sent_at = timezone.now()
            payslip.save()
            return True
        return False