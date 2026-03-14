from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):# กำหนดฟอร์แมตเวลาเป็น HH:mm (24 ชั่วโมง)
    check_in = serializers.TimeField(format="%H:%M", read_only=True)
    check_out = serializers.TimeField(format="%H:%M", read_only=True)
    
    # สำหรับวันที่ ถ้าอยากให้ส่งเป็น YYYY-MM-DD หรือฟอร์แมตอื่น
    date = serializers.DateField(format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Attendance
        fields = ['id', 'date', 'check_in', 'check_out', 'location', 'status']
        read_only_fields = ['id', 'date', 'check_in']