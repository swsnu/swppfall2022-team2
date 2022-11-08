# Generated by Django 4.1.2 on 2022-11-08 06:57

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='chatusers',
            field=models.ManyToManyField(related_name='chatroom_with_this_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
