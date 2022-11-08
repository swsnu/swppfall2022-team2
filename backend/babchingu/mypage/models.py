from django.db import models
#from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # timeTable = ArrayField(ArrayField(models.BooleanField(default=False), blank=True, size=24, ), blank=True, size=5,)
    # timeTable[mon = 0, ..., fri = 4][T] = False if there is no schedule at (9 + T/2) o'clock ~ (9.5 + T/2) o'clock, else True
    # need to add at forms.UserStatusChange.Meta.fields
    temperature = models.FloatField(default = 36.5)
    mbti=models.CharField(default='',max_length=4)
    gender=models.CharField(default='',max_length=1)
    first_name = models.CharField(default='',max_length=30) # 이름
    last_name = models.CharField(default='',max_length=30) # 성
    intro=models.CharField(default='',max_length=100)
    age=models.CharField(default ='',max_length=3)
