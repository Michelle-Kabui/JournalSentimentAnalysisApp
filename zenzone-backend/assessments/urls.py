from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.AssessmentHistoryView.as_view(), name='assessment-history'),
    path('save/', views.SaveAssessmentView.as_view(), name='save-assessment'),
]