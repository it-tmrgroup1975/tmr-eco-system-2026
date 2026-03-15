from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from .models import Payslip

# แก้ไขส่วนการ Import WeasyPrint ให้เป็น Safe Import
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    # กรณีหา library ไม่เจอ (Error 0x7e) จะไม่ทำให้ระบบพัง
    WEASYPRINT_AVAILABLE = False
    HTML = None

class PayrollService:
    """
    Service Layer สำหรับจัดการ Business Logic ของระบบเงินเดือน
    รองรับการคำนวณแบบ 2 ครั้งต่อเดือน (Bi-monthly) ตามมาตรฐานไทย
    """
    
    # มาตรฐานประกันสังคมไทย (อัตรา 5% สูงสุด 750 บาท)
    SSO_RATE = Decimal('0.05')
    SSO_MAX_AMOUNT = Decimal('750.00')
    SSO_MIN_SALARY = Decimal('1650.00')
    SSO_MAX_SALARY = Decimal('15000.00')

    @classmethod
    def calculate_sso(cls, total_month_salary: Decimal) -> Decimal:
        """คำนวณเงินสมทบประกันสังคม โดยปัดเศษเป็นจำนวนเต็มตามมาตรฐานบัญชี"""
        if total_month_salary < cls.SSO_MIN_SALARY:
            return Decimal('0.00')
        
        calculation_base = min(total_month_salary, cls.SSO_MAX_SALARY)
        sso_amount = calculation_base * cls.SSO_RATE
        return sso_amount.quantize(Decimal('1.00')) # ปัดเศษเป็นบาท

    @classmethod
    @transaction.atomic
    def process_bi_monthly_payroll(cls, employee, month, year, cycle, hours_rate, attendance_hours, other_income=Decimal('0')):
        """
        Logic หลักในการประมวลผลเงินเดือนรายงวด
        cycle: '1H' (ต้นเดือน) หรือ '2H' (สิ้นเดือน)
        """
        # 1. คำนวณรายได้งวดปัจจุบัน (Gross Amount)
        current_gross = (hours_rate * attendance_hours) + other_income
        social_security = Decimal('0.00')
        tax_deduction = Decimal('0.00') # TODO: เชื่อมต่อระบบคำนวณภาษีสะสมรายปี

        # 2. Logic การหักประกันสังคม (SSO)
        if cycle == '2H':
            # งวดที่ 2: ดึงรายได้จากงวดแรก (1H) มาคิดรวมเพื่อหัก SSO ทีเดียว
            first_half = Payslip.objects.filter(
                employee=employee,
                period_month=month,
                period_year=year,
                cycle='1H'
            ).first()
            
            total_income_for_sso = current_gross + (first_half.salary_amount if first_half else Decimal('0'))
            social_security = cls.calculate_sso(total_income_for_sso)
        else:
            # งวดที่ 1: จ่ายรายได้เต็มจำนวนตามชั่วโมงงาน/เงินเดือนครึ่งหนึ่ง โดยยังไม่หัก SSO
            social_security = Decimal('0.00')

        # 3. บันทึกหรืออัปเดตข้อมูล Payslip
        payslip, created = Payslip.objects.update_or_create(
            employee=employee,
            period_month=month,
            period_year=year,
            cycle=cycle,
            defaults={
                'hours_rate': hours_rate,
                'attendance_hours': attendance_hours,
                'salary_amount': current_gross,
                'tax_deduction': tax_deduction,
                'social_security': social_security,
                'is_email_sent': False
            }
        )
        return payslip

class PayslipPDFService:
    """Service สำหรับการสร้างไฟล์ PDF จาก Payslip Model"""

    @staticmethod
    def generate_pdf_bytes(payslip):
        """แปลง Payslip เป็น PDF Bytes เพื่อนำไปแนบอีเมลหรือดาวน์โหลด"""
        if not HTML:
            raise ImportError("โปรดติดตั้ง weasyprint เพื่อใช้งานการสร้าง PDF")

        cycle_text = "ต้นเดือน (งวดที่ 1)" if payslip.cycle == '1H' else "สิ้นเดือน (งวดที่ 2)"
        
        context = {
            'payslip': payslip,
            'employee': payslip.employee,
            'cycle_text': cycle_text,
            'net_salary': payslip.net_salary,
            'company_name': getattr(settings, 'COMPANY_NAME', 'TMR Group'),
        }

        # ใช้ Template แยกสำหรับ PDF (เพื่อให้จัด Layout ได้แม่นยำกว่า HTML Email)
        html_string = render_to_string('payroll/pdf_template.html', context)
        
        # สร้าง PDF เป็น Binary Data
        pdf_file = HTML(string=html_string).write_pdf()
        return pdf_file

class PayslipEmailService:
    """Service สำหรับจัดการส่ง Email แจ้งเงินเดือนพร้อมแนบไฟล์ PDF"""

    @staticmethod
    def send_individual_email(payslip):
        """ส่งเมลรายบุคคลพร้อมแนบไฟล์ PDF และอัปเดตสถานะการส่ง"""
        cycle_text = "ต้นเดือน (งวดที่ 1)" if payslip.cycle == '1H' else "สิ้นเดือน (งวดที่ 2)"
        subject = f"ใบแจ้งเงินเดือน {cycle_text} รอบ {payslip.period_month}/{payslip.period_year}"
        
        context = {
            'name': payslip.employee.get_full_name(),
            'period': f"{payslip.period_month}/{payslip.period_year}",
            'cycle_text': cycle_text,
            'net_salary': payslip.net_salary,
            'details': payslip
        }
        
        try:
            # 1. เตรียมเนื้อหาอีเมล (HTML Body)
            html_body = render_to_string('emails/payslip_template.html', context)
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=f"ยอดเงินเดือนสุทธิ: {payslip.net_salary}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[payslip.employee.email]
            )
            email.attach_alternative(html_body, "text/html")
            
            # 2. สร้างไฟล์ PDF และแนบไปกับอีเมล
            try:
                pdf_content = PayslipPDFService.generate_pdf_bytes(payslip)
                filename = f"Payslip_{payslip.employee.employee_id}_{payslip.period_month}_{payslip.period_year}_{payslip.cycle}.pdf"
                email.attach(filename, pdf_content, 'application/pdf')
            except Exception as pdf_error:
                print(f"Warning: Could not generate PDF attachment: {str(pdf_error)}")
                # ยังคงส่งอีเมลต่อไปแม้จะสร้าง PDF ไม่สำเร็จ (หรือจะยกเลิกการส่งก็ได้ตาม Business Logic)
            
            # 3. ทำการส่งอีเมล
            if email.send():
                # บันทึกสถานะการส่งอีเมล
                payslip.is_email_sent = True
                payslip.last_sent_at = timezone.now()
                payslip.save()
                return True
                
        except Exception as e:
            print(f"Failed to send email for Payslip ID {payslip.id}: {str(e)}")
            
        return False