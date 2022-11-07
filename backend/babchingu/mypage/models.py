from django.db import models

class TimeTableDataContainer(models.Model):
    timeTable = [[models.BooleanField(default = False) for i in range(24)]for j in range(5)] 
    # timeTable[mon = 0, ..., fri = 4][T] = False if there is no schedule at (9 + T/2) o'clock ~ (9.5 + T/2) o'clock, else True

class MannerTemperature(models.Model):
    temperature = models.FloatField(default = 36.5)

class MBTI(models.Model):
    mbti=models.CharField(max_length=4)