# Generated by Django 5.0 on 2025-01-03 09:18

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='AssessmentResult',
            new_name='Assessment',
        ),
    ]
