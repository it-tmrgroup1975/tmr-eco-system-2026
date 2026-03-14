import pandas as pd
from django.db import transaction
from .models import Payslip
from django.contrib.auth import get_user_model

User = get_user_model()

class PayrollImportService:
    @staticmethod
    def process_excel(file_obj, month, year):
        """
        อ่านไฟล์ Excel/CSV และสร้าง Payslip
        โครงสร้างไฟล์ที่คาดหวัง: รหัสพนักงาน, Hours Rate, Attendance, Salary, Tax, Social Security
        """
        # อ่านไฟล์ได้ทั้ง CSV และ Excel
        if file_obj.name.endswith('.csv'):
            df = pd.read_csv(file_obj)
        else:
            df = pd.read_excel(file_obj)

        success_count = 0
        errors = []

        with transaction.atomic(): # ใช้ Transaction เพื่อป้องกันข้อมูลพังถ้าเกิด Error กลางคัน
            for index, row in df.iterrows():
                try:
                    emp_code = str(row['รหัสพนักงาน']).strip()
                    user = User.objects.filter(employee_id=emp_code).first() # หรือฟิลด์รหัสพนักงานที่คุณมี
                    
                    if not user:
                        errors.append(f"แถวที่ {index+2}: ไม่พบพนักงานรหัส {emp_code}")
                        continue

                    # สร้างหรืออัปเดต Payslip
                    payslip, created = Payslip.objects.update_or_create(
                        employee=user,
                        period_month=month,
                        period_year=year,
                        defaults={
                            'hours_rate': row['Hours Rate'],
                            'attendance_hours': row['Attendance'],
                            'salary_amount': row['Salary Amount'],
                            'tax_deduction': row.get('Tax', 0),
                            'social_security': row.get('SSO', 0),
                        }
                    )
                    success_count += 1
                except Exception as e:
                    errors.append(f"แถวที่ {index+2}: {str(e)}")

        return success_count, errors