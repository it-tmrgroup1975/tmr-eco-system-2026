import pandas as pd
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Payslip
from .services import PayrollService  # เรียกใช้ Service ที่จัดการ Business Logic

User = get_user_model()

class PayrollImportService:
    @staticmethod
    def process_excel(file_obj, month, year, cycle):
        """
        อ่านไฟล์ Excel/CSV และสร้าง Payslip แยกตามงวด (Cycle)
        cycle: '1H' (งวดต้นเดือน) หรือ '2H' (งวดสิ้นเดือน)
        """
        # 1. ตรวจสอบนามสกุลไฟล์และอ่านข้อมูล
        if file_obj.name.endswith('.csv'):
            df = pd.read_csv(file_obj)
        else:
            df = pd.read_excel(file_obj)

        success_count = 0
        errors = []

        # 2. ใช้ transaction.atomic เพื่อป้องกันข้อมูลผิดพลาด (Data Integrity)
        with transaction.atomic():
            for index, row in df.iterrows():
                try:
                    # ดึงรหัสพนักงานและค้นหา User
                    emp_code = str(row['รหัสพนักงาน']).strip()
                    user = User.objects.filter(employee_id=emp_code).first()
                    
                    if not user:
                        errors.append(f"แถวที่ {index+2}: ไม่พบพนักงานรหัส {emp_code}")
                        continue

                    # 3. เรียกใช้ PayrollService แทนการสร้าง Model โดยตรง
                    # เพื่อให้ Logic การคำนวณ SSO ของงวด 2H ทำงานได้อย่างถูกต้องตามมาตรฐานไทย
                    PayrollService.process_bi_monthly_payroll(
                        employee=user,
                        month=month,
                        year=year,
                        cycle=cycle,
                        hours_rate=row.get('Hours Rate', 0),
                        attendance_hours=row.get('Attendance', 0),
                        other_income=row.get('Other Income', 0)
                    )
                    
                    success_count += 1
                except Exception as e:
                    errors.append(f"แถวที่ {index+2}: {str(e)}")

        return success_count, errors