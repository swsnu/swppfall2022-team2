from django.db import models
#from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

def timeTable_default():
    return {key:False for key in range(140)}

def empty_list():
    return []

class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    temperature = models.FloatField(default = 36.5)
    evaluation_num = models.IntegerField(default=10) # 10 * 36.5로 총 온도값이 시작됨
    mbti=models.CharField(default='',max_length=4)
    gender=models.CharField(default='',max_length=1)
    name = models.CharField(default='',max_length=30) # 이름
    intro=models.CharField(default='',max_length=100)
    birth=models.CharField(default = '000101', max_length=6) #YYMMDD
    time_table=models.JSONField(default=timeTable_default)
    nickname = models.CharField(default='',max_length=30) # 별명
    matched_users=models.JSONField(default=empty_list) # 지금까지 매칭되었던 사람 리스트 (by user id, 중복x)
    unevaluated_users=models.JSONField(default=empty_list) #매칭되었던 사람 중 아직 온도평가안한 유저 (by user id, 중복x)
    blocked_users=models.JSONField(default=empty_list) #차단리스트 (by user id)
    email=models.CharField(default='', max_length=100)
