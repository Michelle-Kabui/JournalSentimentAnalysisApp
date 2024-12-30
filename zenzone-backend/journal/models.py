from django.db import models
from authentication.models import User

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    sentiment = models.CharField(
        max_length=10,
        choices=[
            ('positive', 'Positive'),
            ('negative', 'Negative'),
            ('neutral', 'Neutral')
        ],
        default='neutral'
    )
    mood = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s entry on {self.created_at.strftime('%Y-%m-%d')}"