# Generated by Django 4.1.2 on 2022-11-08 06:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('matching', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchingentity',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matching', to=settings.AUTH_USER_MODEL),
        ),
    ]
