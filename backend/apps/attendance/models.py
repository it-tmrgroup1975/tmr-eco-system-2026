from django.db import models
from django.conf import settings
from django.utils import timezone

class Attendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    check_in = models.TimeField(auto_now_add=True)
    check_out = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, default='normal') # normal, late, etc.

    class Meta:
        unique_together = ('user', 'date') # หนึ่งวันเข้างานได้ครั้งเดียว
        ordering = ['-date', '-check_in']

    def __str__(self):
        return f"{self.user.email} - {self.date}"