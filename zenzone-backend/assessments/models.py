from django.db import models
from authentication.models import User

class Assessment(models.Model):
    ASSESSMENT_TYPES = [
        ('MDQ', 'Mood Disorder Questionnaire'),
        ('BSDS', 'Bipolar Spectrum Diagnostic Scale')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    assessment_type = models.CharField(max_length=4, choices=ASSESSMENT_TYPES)
    date_taken = models.DateTimeField(auto_now_add=True)
    
    # MDQ specific fields
    mdq_yes_answers = models.IntegerField(null=True, blank=True)
    mdq_same_time_period = models.BooleanField(null=True, blank=True)
    mdq_problem_level = models.IntegerField(null=True, blank=True)
    
    # BSDS specific fields
    bsds_checked_statements = models.IntegerField(null=True, blank=True)
    bsds_story_fit = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-date_taken']

    def __str__(self):
        return f"{self.user.username}'s {self.assessment_type} on {self.date_taken.strftime('%Y-%m-%d')}"