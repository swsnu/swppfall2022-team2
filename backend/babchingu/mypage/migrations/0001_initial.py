# Generated by Django 4.1.3 on 2022-12-04 07:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import mypage.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.FloatField(default=36.5)),
                ('evaluation_num', models.IntegerField(default=10)),
                ('mbti', models.CharField(default='', max_length=4)),
                ('gender', models.CharField(default='', max_length=1)),
                ('name', models.CharField(default='', max_length=30)),
                ('intro', models.CharField(default='', max_length=100)),
                ('age', models.IntegerField(default=20)),
                ('birth', models.CharField(default='000101', max_length=6)),
                ('nickname', models.CharField(default='', max_length=30)),
                ('matched_users', models.JSONField(default=mypage.models.empty_list)),
                ('unevaluated_users', models.JSONField(default=mypage.models.empty_list)),
                ('blocked_users', models.JSONField(default=mypage.models.empty_list)),
                ('email', models.CharField(default='', max_length=130)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
