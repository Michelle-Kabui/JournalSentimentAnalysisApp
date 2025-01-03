from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)