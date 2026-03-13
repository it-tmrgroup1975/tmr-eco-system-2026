from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# --- Serializers สำหรับ Normalization Data ---

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        from .models import Department # Import ภายในเพื่อป้องกัน Circular Import
        model = Department
        fields = ['id', 'name', 'code']

class PositionSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        from .models import Position
        model = Position
        fields = ['id', 'name', 'department', 'department_name']

# --- Serializers สำหรับ Employee Management ---

class EmployeeListSerializer(serializers.ModelSerializer):
    """ใช้สำหรับการแสดงรายชื่อพนักงานในตาราง (List View)"""
    department_name = serializers.ReadOnlyField(source='department.name')
    position_name = serializers.ReadOnlyField(source='position.name')
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'employee_id', 'first_name', 'last_name', 'full_name',
            'username', 'email', 'phone_number',  # เปลี่ยนให้ตรงกับชื่อ field ใน Model/Frontend
            'department', 'department_name', # เพิ่ม department (writable)
            'position', 'position_name',     # เพิ่ม position (writable)
            'employment_type', 'avatar', 'avatar_url'
        ]
        extra_kwargs = {
            'username': {'required': False},
            'department': {'write_only': True}, # รับค่าตอนสร้าง แต่ไม่ส่งออกตอน Get
            'position': {'write_only': True},
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

    def validate(self, attrs):
        # ถ้าไม่มี username ให้ใช้ email แทน
        if not attrs.get('username') and attrs.get('email'):
            attrs['username'] = attrs.get('email')
        return super().validate(attrs)

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

# --- Serializer สำหรับ Authentication (Login) ---

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # เพิ่ม Custom Claims ลงใน Payload ของ JWT Token
        token['username'] = user.username
        token['role'] = user.role
        token['employee_id'] = user.employee_id
        return token

    def validate(self, attrs):
        # เรียกใช้ validate เดิมเพื่อให้ได้ access/refresh tokens
        data = super().validate(attrs)
        
        # เพิ่มข้อมูลโปรไฟล์ผู้ใช้กลับไปใน Response Body เพื่อให้ Frontend (Zustand) ใช้งานได้ทันที
        data['user'] = {
            'id': self.user.id,
            'employee_id': self.user.employee_id,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'department': self.user.department.name if self.user.department else None,
            'position': self.user.position.name if self.user.position else None,
        }
        return data