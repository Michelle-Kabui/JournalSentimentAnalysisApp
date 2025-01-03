from django.db import models
from django.conf import settings

class Reminder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=[
        ('APP_USAGE', 'App Usage Reminder'),
        ('ASSESSMENT', 'Assessment Reminder')
    ])
    time = models.TimeField()
    days = models.CharField(max_length=100)  # Store as JSON string
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s {self.type} reminder at {self.time}"