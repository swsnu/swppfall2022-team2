# Generated by Django 4.1.2 on 2022-11-08 08:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MatchingQueue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='MatchingEntity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_matching', models.TimeField()),
                ('user_mbti', models.CharField(max_length=4)),
                ('user_gender', models.CharField(max_length=1)),
                ('user_age', models.IntegerField()),
                ('time', models.IntegerField()),
                ('space', models.TextField()),
                ('mbti_wanted', models.JSONField()),
                ('gender_wanted', models.CharField(max_length=1)),
                ('age_wanted_from', models.IntegerField(default=0)),
                ('age_wanted_to', models.IntegerField(default=100)),
                ('matched_opponent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='matching.matchingentity')),
                ('queue', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='entities', to='matching.matchingqueue')),
            ],
        ),
    ]
