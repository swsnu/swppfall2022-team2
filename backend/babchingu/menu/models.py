from django.db import models

class TodayMenu(models.Model):
    mealtype=models.CharField(max_length=120)
    menuplace=models.CharField(max_length=120)
    menuname=models.CharField(max_length=120)
    menuprice=models.CharField(max_length=120)
    menuextra=models.CharField(max_length=200)

