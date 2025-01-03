from rest_framework import serializers
from .models import Assessment

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = [
            'id', 'assessment_type', 'date_taken',
            'mdq_yes_answers', 'mdq_same_time_period', 'mdq_problem_level',
            'bsds_checked_statements', 'bsds_story_fit'
        ]
        read_only_fields = ['date_taken']