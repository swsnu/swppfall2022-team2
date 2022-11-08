from django.db import models
#from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User


class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    temperature = models.FloatField(default = 36.5)
    mbti=models.CharField(default='',max_length=4)
    gender=models.CharField(default='',max_length=1)
    first_name = models.CharField(default='',max_length=30) # 이름
    last_name = models.CharField(default='',max_length=30) # 성
    intro=models.CharField(default='',max_length=100)
    age=models.IntegerField(default =20)