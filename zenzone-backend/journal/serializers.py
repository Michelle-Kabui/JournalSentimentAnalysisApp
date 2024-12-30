from rest_framework import serializers
from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'content', 'sentiment', 'mood', 'created_at', 'updated_at']
        read_only_fields = ['sentiment', 'created_at', 'updated_at']