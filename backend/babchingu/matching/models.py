from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, date
class MatchingQueue(models.Model):
    # for improve perpormance, I think storing information of last matching would be good
    # if many users check continuously, the server can be overloaded so block those danger
    def num_matching(self):
        return self.entities.all().filter(matched_opponent=None).count()
    def match_FIFO(self):
        # simple matching that matches by First-in First-out 
        entities=self.entities.all()
        no_matched_entities=entities.filter(matched_opponent=None)
        if no_matched_entities.count()>=2 :
            entity1=no_matched_entities[0]
            entity2=no_matched_entities[1]
            entity1.matched_opponent=entity2
            entity2.matched_opponent=entity1
            entity1.save()
            entity2.save()
            self.num_matching-=2

    def check_condition_count(self, entity1, entity2): 
        # returns the number of not matched condition between entity1 and entity2
        # since return value -1 and -2 means they cannot be matched
        # you should check return value >=0 whenever use this function
        # it is important that this function do not examine whether entity1=entity2
        # so before call this function, it should be examined that they are not same entity
        no_match_condition=0
        if entity1.matched_opponent is not None or entity2.matched_opponent is not None:
            return -1 # -1 means error: entity1 or entity2 has been already matched
        if entity1.time !=entity2.time:
            return -2 # -2 means it they cannot be matched as the time is different
        if entity1.space !=entity2.space:
            no_match_condition+=1 # this is problem should we admit the different place?
        if not(entity2.user_age>=entity1.age_wanted_from and entity2.user_age<=entity1.age_wanted_to):
            no_match_condition+=1
        if not(entity1.user_age>=entity2.age_wanted_from and entity1.user_age<=entity2.age_wanted_to):
            no_match_condition+=1
        if not(entity1.gender_wanted=="" or entity2.user_gender==entity1.gender_wanted):
            no_match_condition+=1
        if not(entity2.gender_wanted=="" or entity1.user_gender==entity2.gender_wanted):
            no_match_condition+=1
        if not(entity1.mbti_wanted==[]):
            mbti_list=entity1.mbti_wanted
            if not entity2.user_mbti in mbti_list:
                no_match_condition+=1 # NOTE: the user MUST have valid mbti
        if not(entity2.mbti_wanted==[]):
            mbti_list=entity2.mbti_wanted
            if not entity1.user_mbti in mbti_list:
                no_match_condition+=1
        return no_match_condition

    def check_condition_oneway(self, entity_this, entity_target): 
        # returns the number of not matched condition in entity_target from entith_this's condition
        # max return value is 4: all conditions not satisfied
        # since return value -1 and -2 means they cannot be matched
        # you should check return value >=0 whenever use this function
        # it is important that this function do not examine whether entity1=entity2
        # so before call this function, it should be examined that they are not same entity
        no_match_condition=0
        if entity_this.matched_opponent is not None or entity_target.matched_opponent is not None:
            return -1 # -1 means error: has been already matched some entity
        if entity_this.time !=entity_target.time:
            return -2 # -2 means it they cannot be matched as the time is different
        if entity_this.space !=entity_target.space:
            no_match_condition+=1 # this is problem should we admit the different place?
        if not(entity_target.user_age>=entity_this.age_wanted_from and entity_target.user_age<=entity_this.age_wanted_to):
            no_match_condition+=1
        if not(entity_this.gender_wanted=="" or entity_target.user_gender==entity_this.gender_wanted):
            no_match_condition+=1
        if not(entity_this.mbti_wanted==[]):
            mbti_list=entity_this.mbti_wanted
            if not entity_target.user_mbti in mbti_list:
                no_match_condition+=1 # NOTE: the user MUST have valid mbti
        return no_match_condition

    def check_condition_match_exactly_same(self, entity1, entity2):
        # check the whole condition of matching entity1 and entity2
        # return true only when the all conditions same
        # it is important that this function do not examine whether entity1=entity2
        # so before call this function, it should be examined that they are not same entity

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
        if not(entity1.mbti_wanted==[]):
            mbti_list=entity1.mbti_wanted
            if not entity2.user_mbti in mbti_list:
                return False # NOTE: the user MUST have valid mbti
        if not(entity2.mbti_wanted==[]):
            mbti_list=entity2.mbti_wanted
            if not entity1.user_mbti in mbti_list:
                return False
        return True

    def match_exactly_same(self):
        # I think it would be goot to match this first and next match below match_adapt
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
    def match_adapt(self):
        # as time goes, reduce the num of conditions that should meet
        # for test, currently every 1 mins
        entities=self.entities.all()
        no_matched_entities=entities.filter(matched_opponent=None)
        for entity1 in no_matched_entities:
            if entity1.matched_opponent is not None:# already matched by other entity
                continue
            for entity2 in no_matched_entities:
                if entity1!=entity2 and entity2.matched_opponent is None:
                    time_cur=datetime.now()
                    entity1_time=datetime.combine(datetime.today(),entity1.time_matching)
                    entity2_time=datetime.combine(datetime.today(),entity2.time_matching)
                    adapt_entity1=(time_cur-entity1_time).seconds/60 # num of ignoring conditions
                    adapt_entity2=(time_cur-entity2_time).seconds/60 # num of ignoring conditions
                    entity1_conditions_unmet=self.check_condition_oneway(entity1, entity2) # num of unmet conditions
                    entity2_conditions_unmet=self.check_condition_oneway(entity2, entity1) # num of unmet conditions
                    if 0<=entity1_conditions_unmet<=adapt_entity1 and 0<=entity2_conditions_unmet<=adapt_entity2:
                        entity1.matched_opponent=entity2
                        entity2.matched_opponent=entity1
                        entity1.save()
                        entity2.save()

    def save(self, *args, **kwargs):
        if MatchingQueue.objects.exists(): #singleton
            raise AttributeError("Singleton")
        return super(MatchingQueue, self).save(*args, **kwargs)

class MatchingEntity(models.Model):
    time_matching=models.TimeField()#How long this matching is not success
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
    