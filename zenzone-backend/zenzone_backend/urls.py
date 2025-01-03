from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/journal/', include('journal.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/reminders/', include('reminders.urls')),

]