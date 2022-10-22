from django.db import models
from django.contrib.auth.models import User

class MatchingEntity(models):
    time_matching=models.TimeField(auto_now_add=True)#How long this matching is not success
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='matching'
    )
    '''This user information, can be moved to User class?? '''
    user_mbti=models.TextField()
    user_gender=models.CharField()
    user_age=models.IntegerField()
    '''This user information'''

    ''' matching conditions '''
    time=models.TimeField()
    space=models.TextField()
    mbti_wanted=models.JSONField()
    gender_wanted=models.CharField()
    age_wanted=models.JSONField()
    ''' matching conditions '''
    