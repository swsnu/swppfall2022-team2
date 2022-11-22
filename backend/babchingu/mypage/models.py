from django.db import models
#from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

def timeTable_default():
    return {key:False for key in range(140)}

class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    temperature = models.FloatField(default = 36.5)
    evaluation_num = models.IntegerField(default=10) # 10 * 36.5로 총 온도값이 시작됨
    mbti=models.CharField(default='',max_length=4)
    gender=models.CharField(default='',max_length=1)
    name = models.CharField(default='',max_length=30) # 이름
    intro=models.CharField(default='',max_length=100)
    age=models.IntegerField(default =20)
    time_table=models.JSONField(default=timeTable_default)
    nickname = models.CharField(default='',max_length=30) # 별명