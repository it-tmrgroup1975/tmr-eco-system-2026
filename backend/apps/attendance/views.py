from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        # ดึงข้อมูลเฉพาะของ User ที่ Login อยู่ และเรียงจากวันที่ล่าสุด
        return Attendance.objects.filter(user=self.request.user).order_by('-date', '-check_in')

    @action(detail=False, methods=['post'])
    def check_in(self, request):
        # ใช้ .date() เพื่อดึงเฉพาะวันที่ ไม่เอาเวลาและ Timezone
        today = timezone.now().date() 
        
        if Attendance.objects.filter(user=request.user, date=today).exists():
            return Response({"error": "วันนี้คุณเช็คอินไปแล้ว"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # บังคับส่งค่า date เป็นวัตถุ date เท่านั้น
            serializer.save(user=request.user, date=today) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def check_out(self, request):
        # timezone.now() จะคืนค่าปัจจุบันที่คำนวณตาม TIME_ZONE ใน settings แล้ว
        current_time = timezone.now()
        
        attendance = Attendance.objects.filter(
            user=request.user, 
            date=current_time, 
            check_out__isnull=True
        ).first()

        if not attendance:
            return Response(
                {"error": "ไม่พบข้อมูลการเช็คอินของวันนี้ หรือคุณเช็คเอาท์ไปแล้ว"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # บันทึกเวลาปัจจุบันเป็นเวลา Check-out
        attendance.check_out = current_time.time()
        attendance.save()
        
        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """ดึงข้อมูลการเข้างานของวันนี้ (ถ้ามี)"""
        today = timezone.now().date()
        attendance = Attendance.objects.filter(user=request.user, date=today).first()
        if attendance:
            serializer = self.get_serializer(attendance)
            return Response(serializer.data)
        return Response(None, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """ดึงประวัติย้อนหลัง (ตัวอย่าง: ย้อนหลัง 30 รายการ)"""
        queryset = self.get_queryset()[:30]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)