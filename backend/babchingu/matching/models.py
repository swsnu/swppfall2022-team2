from email.policy import default
from django.db import models
from django.contrib.auth.models import User

class MatchingQueue(models.Model):
    num_matching=models.IntegerField()#num of currently matching
    def match(self):
        entities=self.entities.all()
        no_matched_entities=entities.filter(matched_opponent=None)
        if no_matched_entities.count()>=2 :
            entity1=no_matched_entities[0]
            entity2=no_matched_entities[1]
            entity1.matched_opponent=entity2
            entity2.matched_opponent=entity1
            entity1.save()
            entity2.save()


    def check_condition_match_exactly_same(self, entity1, entity2):
        if entity1.matched_opponent is not None or entity2.matched_opponent is not None:
            return False
        if entity1.time !=entity2.time:
            return False
        if entity1.space !=entity2.space:
            return False
        if not(entity2.user_age>=entity1.age_wanted_from and entity2.user_age<=entity1.age_wanted_to):
            return False
        if not(entity1.user_age>=entity2.age_wanted_from and entity1.user_age<=entity2.age_wanted_to):
            return False
        if not(entity1.gender_wanted=="" or entity2.user_gender==entity1.gender_wanted):
            return False
        if not(entity2.gender_wanted=="" or entity1.user_gender==entity2.gender_wanted):
            return False
        if not(entity1.mbti_wanted=={}):
            mbti_list=entity1.mbti_wanted
            if not entity2.user_mbti in mbti_list:
                return False # NOTE: the user MUST have valid mbti
        if not(entity2.mbti_wanted=={}):
            mbti_list=entity2.mbti_wanted
            if not entity1.user_mbti in mbti_list:
                return False
        return True

    def match_exactly_same(self):
        entities=self.entities.all()
        no_matched_entities=entities.filter(matched_opponent=None)
        for entity1 in no_matched_entities:
            if entity1.matched_opponent is not None:# already matched by other entity
                continue
            for entity2 in no_matched_entities:
                if entity1!=entity2 and entity2.matched_opponent is None:
                    if self.check_condition_match_exactly_same(entity1, entity2):
                        entity1.matched_opponent=entity2
                        entity2.matched_opponent=entity1
                        entity1.save()
                        entity2.save()


    def save(self, *args, **kwargs):
        if MatchingQueue.objects.exists(): #singleton
            raise AttributeError("Singleton")
        return super(MatchingQueue, self).save(*args, **kwargs)

class MatchingEntity(models.Model):
    time_matching=models.TimeField(auto_now_add=True)#How long this matching is not success
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='matching'
    )
    '''This user information, can be moved to User class?? '''
    user_mbti=models.CharField(max_length=4)
    user_gender=models.CharField(max_length=1)
    user_age=models.IntegerField()
    '''This user information'''

    ''' matching conditions '''
    time=models.IntegerField()#this field type should be changed
    space=models.TextField()
    mbti_wanted=models.JSONField() # I don't know why but it is okay to store list in jsonfield
    gender_wanted=models.CharField(max_length=1)
    age_wanted_from=models.IntegerField(default=0)
    age_wanted_to=models.IntegerField(default=100)
    ''' matching conditions '''

    #when matched, indicating the opponent
    #https://stackoverflow.com/questions/15285626/django-self-referential-foreign-key
    matched_opponent=models.ForeignKey('self', null=True, on_delete=models.CASCADE)

    queue=models.ForeignKey(
        MatchingQueue,
        on_delete=models.CASCADE,
        related_name="entities",
        null=True
    )
    