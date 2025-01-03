from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'title', 'type', 'time', 'days', 'is_active', 'created_at']
        read_only_fields = ['created_at']