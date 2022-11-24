# Generated by Django 4.1.2 on 2022-11-18 05:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('matching', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupMatchingQueue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='GroupMatchingEntity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_matching', models.TimeField()),
                ('time', models.IntegerField()),
                ('menu', models.TextField()),
                ('num', models.CharField(max_length=2)),
                ('matched', models.BooleanField(default=False)),
                ('queue', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='groupEntities', to='matching.groupmatchingqueue')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='groupMatching', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]