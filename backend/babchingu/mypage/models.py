from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    timeTable = [[models.BooleanField(default = False) for i in range(24)]for j in range(5)] 
    # timeTable[mon = 0, ..., fri = 4][T] = False if there is no schedule at (9 + T/2) o'clock ~ (9.5 + T/2) o'clock, else True
    temperature = models.FloatField(default = 36.5)
    mbti=models.CharField(max_length=4)
    gender=models.CharField(max_length=1)
    first_name = None
    last_name = None
    intro=models.CharField(max_length=100)
