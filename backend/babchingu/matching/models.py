from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
class MatchingQueue(models.Model):
    def num_matching(self):
        return self.entities.all().filter(matched_opponent=None).count()
        
    # def match_FIFO(self): # Do not use this in current version
    #     # simple matching that matches by First-in First-out 
    #     entities=self.entities.all()
    #     no_matched_entities=entities.filter(matched_opponent=None)
    #     if no_matched_entities.count()>=2 :
    #         entity1=no_matched_entities[0]
    #         entity2=no_matched_entities[1]
    #         entity1.matched_opponent=entity2
    #         entity2.matched_opponent=entity1
    #         entity1.save()
    #         entity2.save()
    #         self.num_matching-=2

    # def check_condition_count(self, entity1, entity2): # Do not use this in current version
    #     # returns the number of not matched condition between entity1 and entity2
    #     # since return value -1 and -2 means they cannot be matched
    #     # you should check return value >=0 whenever use this function
    #     # it is important that this function do not examine whether entity1=entity2
    #     # so before call this function, it should be examined that they are not same entity
    #     no_match_condition=0
    #     if entity1.matched_opponent is not None or entity2.matched_opponent is not None:
    #         return -1 # -1 means error: entity1 or entity2 has been already matched
    #     if entity1.time !=entity2.time:
    #         return -2 # -2 means it they cannot be matched as the time is different
    #     if entity1.space !=entity2.space:
    #         no_match_condition+=1 # this is problem should we admit the different place?
    #     if not(entity2.user_age>=entity1.age_wanted_from and entity2.user_age<=entity1.age_wanted_to):
    #         no_match_condition+=1
    #     if not(entity1.user_age>=entity2.age_wanted_from and entity1.user_age<=entity2.age_wanted_to):
    #         no_match_condition+=1
    #     if not(entity1.gender_wanted=="" or entity2.user_gender==entity1.gender_wanted):
    #         no_match_condition+=1
    #     if not(entity2.gender_wanted=="" or entity1.user_gender==entity2.gender_wanted):
    #         no_match_condition+=1
    #     if not(entity1.mbti_wanted==[]):
    #         mbti_list=entity1.mbti_wanted
    #         if not entity2.user_mbti in mbti_list:
    #             no_match_condition+=1 # NOTE: the user MUST have valid mbti
    #     if not(entity2.mbti_wanted==[]):
    #         mbti_list=entity2.mbti_wanted
    #         if not entity1.user_mbti in mbti_list:
    #             no_match_condition+=1
    #     return no_match_condition

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

    # def check_condition_match_exactly_same(self, entity1, entity2): # Do not use in current version
    #     # check the whole condition of matching entity1 and entity2
    #     # return true only when the all conditions same
    #     # it is important that this function do not examine whether entity1=entity2
    #     # so before call this function, it should be examined that they are not same entity

    #     if entity1.matched_opponent is not None or entity2.matched_opponent is not None:
    #         return False
    #     if entity1.time !=entity2.time:
    #         return False
    #     if entity1.space !=entity2.space:
    #         return False
    #     if not(entity2.user_age>=entity1.age_wanted_from and entity2.user_age<=entity1.age_wanted_to):
    #         return False
    #     if not(entity1.user_age>=entity2.age_wanted_from and entity1.user_age<=entity2.age_wanted_to):
    #         return False
    #     if not(entity1.gender_wanted=="" or entity2.user_gender==entity1.gender_wanted):
    #         return False
    #     if not(entity2.gender_wanted=="" or entity1.user_gender==entity2.gender_wanted):
    #         return False
    #     if not(entity1.mbti_wanted==[]):
    #         mbti_list=entity1.mbti_wanted
    #         if not entity2.user_mbti in mbti_list:
    #             return False # NOTE: the user MUST have valid mbti
    #     if not(entity2.mbti_wanted==[]):
    #         mbti_list=entity2.mbti_wanted
    #         if not entity1.user_mbti in mbti_list:
    #             return False
    #     return True

    # def match_exactly_same(self): # Do not use in current version
    #     # I think it would be goot to match this first and next match below match_adapt
    #     entities=self.entities.all()
    #     no_matched_entities=entities.filter(matched_opponent=None)
    #     for entity1 in no_matched_entities:
    #         if entity1.matched_opponent is not None:# already matched by other entity
    #             continue
    #         for entity2 in no_matched_entities:
    #             if entity1!=entity2 and entity2.matched_opponent is None:
    #                 if self.check_condition_match_exactly_same(entity1, entity2):
    #                     entity1.matched_opponent=entity2
    #                     entity2.matched_opponent=entity1
    #                     entity1.save()
    #                     entity2.save()
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
                        userinfo1=entity1.user.userinfo
                        userinfo2=entity2.user.userinfo
                        if entity2.user.id not in userinfo1.matched_users:
                            userinfo1.matched_users.append(entity2.user.id)
                        if entity1.user.id not in userinfo2.matched_users:
                            userinfo2.matched_users.append(entity1.user.id)
                        if entity2.user.id not in userinfo1.unevaluated_users:
                            userinfo1.unevaluated_users.append(entity2.user.id)
                        if entity1.user.id not in userinfo2.unevaluated_users:
                            userinfo2.unevaluated_users.append(entity1.user.id)
                        userinfo1.save()
                        userinfo2.save()
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
    invalid=models.BooleanField(default=False) #for user start new matching
    queue=models.ForeignKey(
        MatchingQueue,
        on_delete=models.CASCADE,
        related_name="entities",
        null=True
    )
    

#
# below here, group matching models
#

class GroupMatchingQueue(models.Model):
    def num_matching(self):
        return self.groupEntities.all().filter(matched=False).count()

    def check_condition_match_exactly_same(self, entity1, entity2):
        # check the whole condition of matching entity1 and entity2
        # return true only when the all conditions same
        # it is important that this function do not examine whether entity1=entity2
        # so before call this function, it should be examined that they are not same entity

        if entity1.matched or entity2.matched:
            return False
        if entity1.time !=entity2.time:
            return False
        if entity1.menu !=entity2.menu:
            return False
        if entity1.num !=entity2.num:
            return False
        return True

    def match_exactly_same(self):
        entities=self.groupEntities.all()
        no_matched_entities=entities.filter(matched=False)
        for entity1 in no_matched_entities:
            for entity2 in no_matched_entities:
                if entity1!=entity2 and self.check_condition_match_exactly_same(entity1, entity2):
                    if entity1.id not in entity2.matched_opponents:
                        entity2.matched_opponents.append(entity1.id)
                        entity1.matched_opponents.append(entity2.id)
                        entity1.save()
                        entity2.save()
        # At here, all entities having same conditions have each other in matched_opponents
        # now check the size of matched_opponents and make them really matched if possible
        for entity in no_matched_entities:
            num_opponent=len(entity.matched_opponents)
            if (int(entity.num[0])-1)==num_opponent or (int(entity.num[1])-1)==num_opponent:
                # enough people assembled
                # do not consider the case when assembled exceeding the condition num
                # because everytime a person start match, this function would be executed
                entity.matched=True
                entity.save()
                for entity_id in entity.matched_opponents:
                    entity_matched=GroupMatchingEntity.objects.get(id=entity_id)
                    entity_matched.matched=True
                    userinfo=entity.user.userinfo
                    if entity_matched.user.id not in userinfo.matched_users:
                        userinfo.matched_users.append(entity_matched.user.id)
                    if entity_matched.user.id not in userinfo.unevaluated_users:
                        userinfo.unevaluated_users.append(entity_matched.user.id)
                    userinfo.save()
                    entity.save()
                    entity_matched.save()

                # save the history of matching in userinfo
                for entity1_id in entity.matched_opponents:
                    for entity2_id in entity.matched_opponents:
                        if entity1_id !=entity2_id:
                            entity1=GroupMatchingEntity.objects.get(id=entity1_id)
                            entity2=GroupMatchingEntity.objects.get(id=entity2_id)
                            userinfo1=entity1.user.userinfo
                            userinfo2=entity2.user.userinfo
                            if entity2.user.id not in userinfo1.matched_users:
                                userinfo1.matched_users.append(entity2.user.id)
                            if entity1.user.id not in userinfo2.matched_users:
                                userinfo2.matched_users.append(entity1.user.id)
                            if entity2.user.id not in userinfo1.unevaluated_users:
                                userinfo1.unevaluated_users.append(entity2.user.id)
                            if entity1.user.id not in userinfo2.unevaluated_users:
                                userinfo2.unevaluated_users.append(entity1.user.id)
                            userinfo1.save()
                            userinfo2.save()
                            entity1.save()
                            entity2.save()
    
    def remove_entity(self, id):
        # when stop group matching, the id of target entity should be removed
        # from other entity's matched_opponents
        entities=self.groupEntities.all()
        no_matched_entities=entities.filter(matched=False)
        for entity in no_matched_entities:
            if id in entity.matched_opponents:
                entity.matched_opponents.remove(id)



class GroupMatchingEntity(models.Model):
    time_matching=models.TimeField()#How long this matching is not success
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='groupMatching'
    )

    ''' matching conditions '''
    time=models.IntegerField()#this field type should be changed
    menu=models.TextField()
    num=models.CharField(max_length=2)
    ''' matching conditions '''

    
    matched_opponents=models.JSONField()
    matched=models.BooleanField(default=False)
    invalid=models.BooleanField(default=False) #for user start new matching
    queue=models.ForeignKey(
        GroupMatchingQueue,
        on_delete=models.CASCADE,
        related_name="groupEntities",
        null=True
    )
