from django.test import TestCase, Client
from django.contrib.auth.models import User
from mypage.models import UserInfo
from datetime import datetime
import json
from .models import MatchingQueue, GroupMatchingEntity, GroupMatchingQueue
class MatchTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create_user(username="user1", password="pw1")
        user2 = User.objects.create_user(username="user2", password="pw2")
        user3 = User.objects.create_user(username="user3", password="pw3")
        userinfo1=UserInfo(user=user1)
        userinfo1.mbti='ESTJ'
        userinfo1.gender='M'
        userinfo1.age=22
        userinfo1.save()
        userinfo2=UserInfo(user=user2)
        userinfo2.mbti='ESTJ'
        userinfo2.gender='M'
        userinfo2.age=23
        userinfo2.save()
        userinfo3=UserInfo(user=user3)
        userinfo3.mbti='ESTJ'
        userinfo3.gender='M'
        userinfo3.age=22
        userinfo3.save()

    def test_start(self):
        client=Client()
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response=client.get('/matching/start/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTP','gender':'M',
                                'age':{'from':'20','to':'22'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)

    def test_check(self):
        client=Client()
        #login
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #when no match started yet
        response=client.get('/matching/check/1/')
        self.assertEqual(response.status_code,404)

        #start a matching
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        id=response.json()['id'] # would be used below

        # invalid entity id
        response=client.get('/matching/check/9999/')
        self.assertEqual(response.status_code,404)
        
        #not matched yet
        response=client.get('/matching/check/{}/'.format(id))
        self.assertEqual(response.status_code,204)

        #start another matching
        client2=Client()
        response2=client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        self.assertEqual(response2.status_code, 200)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)
        
        #now check matched
        response=client.get('/matching/check/{}/'.format(id))
        self.assertEqual(response.status_code,200)

    def test_get(self):
        client=Client()
        #login
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #when no match started yet
        response=client.get('/matching/get/')
        self.assertEqual(response.status_code,404)

        #start a matching
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)

        # this user did not started any matching
        client2=Client()
        response2=client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        self.assertEqual(response2.status_code, 200)
        response2=client2.get('/matching/get/')
        self.assertEqual(response2.status_code,404)

        # not matched yet
        response=client.get('/matching/get/')
        self.assertEqual(response.status_code,201)

        # start another matching so that match
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)

        # now get matched
        response=client.get('/matching/get/')
        self.assertEqual(response.status_code,200)

    def test_check_match_condition(self): # check_condition_oneway in models.py
        # check the matching logic

        #login two user
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        
        #when time is different:no matched
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'1','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)

        #when space is not met
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'dormitory','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'301','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)
        #when age is not met
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'20'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'1','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'21','to':'21'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)

        #when gender is not met
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'F',
                                'age':{'from':'20','to':'20'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'1','space':'','mbti':'ESTJ','gender':'F',
                                'age':{'from':'21','to':'21'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)

        #when mbti is not met
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':['ISTJ'],'gender':'F',
                                'age':{'from':'20','to':'20'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)
        response2=client2.post('/matching/start/', json.dumps({'condition':{'time':'1','space':'','mbti':['ISTJ'],'gender':'F',
                                'age':{'from':'21','to':'21'}}}), content_type='application/json')
        self.assertEqual(response2.status_code,201)

    def test_queue_singleton(self):
        #testing the singleton pattern of our matchingqueue
        #first make one queue in normal way
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        response=client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        self.assertEqual(response.status_code,201)

        #try to make one more matchingqueue by force
        oneMoreQueue=MatchingQueue()
        try:
            oneMoreQueue.save()
        except AttributeError:
            pass
    def test_match_condition_impossible(self):
        # actually this case have no meaning and cannot occur, but for coverage
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        queue=MatchingQueue.objects.all()[0]
        entity1=queue.entities.all()[0]
        entity2=queue.entities.all()[1]
        # they have been already matched so this checking condition have no meaning
        # but try to check the condition of each
        err=queue.check_condition_oneway(entity1, entity2)
        self.assertEqual(err,-1)

    def test_405(self):
        client=Client()
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        response=client.post('/matching/check/1/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/get/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/stop/')
        self.assertEqual(response.status_code,405)
        response=client.get('/matching/end/')
        self.assertEqual(response.status_code,405)
        response=client.get('/matching/group/start/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/group/check/1/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/group/get/')
        self.assertEqual(response.status_code,405)
        response=client.post('/matching/group/stop/')
        self.assertEqual(response.status_code,405)
        response=client.get('/matching/group/end/')
        self.assertEqual(response.status_code,405)

    def test_stop(self):
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        # when try to stop no exist matching
        response=client.delete('/matching/stop/')
        self.assertEqual(response.status_code,404)

        # successfully stop matching
        client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        response=client.delete('/matching/stop/')
        self.assertEqual(response.status_code,200)

        # when try to stop already matched matching
        client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        client2.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        response=client.delete('/matching/stop/')
        self.assertEqual(response.status_code,403)

    def test_end(self):
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        # when try to end no exist matching
        response=client.post('/matching/end/')
        self.assertEqual(response.status_code,404)

        # successfully ended
        client.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        client2.post('/matching/start/', json.dumps({'condition':{'time':'0','space':'','mbti':'ESTJ','gender':'M',
                                'age':{'from':'20','to':'25'}}}), content_type='application/json')
        response=client.post('/matching/end/')
        self.assertEqual(response.status_code,200)

    def test_group_start(self):
        client=Client()
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        response=client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response.status_code,201)


    def test_group_check(self):
        client=Client()
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        #when no match started yet
        response=client.get('/matching/group/check/1/')
        self.assertEqual(response.status_code,404)

        #start a matching
        response=client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response.status_code,201)
        id=response.json()['id'] # would be used below

        # invalid entity id
        response=client.get('/matching/group/check/9999/')
        self.assertEqual(response.status_code,404)
        
        #not matched yet
        response=client.get('/matching/group/check/{}/'.format(id))
        self.assertEqual(response.status_code,204)

        #start another matching
        client2=Client()
        response2=client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        self.assertEqual(response2.status_code, 200)
        response2=client2.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response2.status_code,201)
        #start another matching
        client3=Client()
        response3=client3.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'pw3'}),
                     content_type='application/json')
        self.assertEqual(response3.status_code, 200)
        response3=client3.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response3.status_code,201)

        #now check matched
        response=client.get('/matching/group/check/{}/'.format(id))
        self.assertEqual(response.status_code,200)

    def test_group_get(self):
        client=Client()
        response=client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #when no match started yet
        response=client.get('/matching/group/get/')
        self.assertEqual(response.status_code,404)

        #start a matching
        response=client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response.status_code,201)

        # this user did not started any matching
        client2=Client()
        response2=client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        self.assertEqual(response2.status_code, 200)
        response2=client2.get('/matching/group/get/')
        self.assertEqual(response2.status_code,404)
        
        # not matched yet
        response=client.get('/matching/group/get/')
        self.assertEqual(response.status_code,201)

        # start other matchings so that match
        response2=client2.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response2.status_code,201)
        client3=Client()
        response3=client3.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'pw3'}),
                     content_type='application/json')
        self.assertEqual(response3.status_code, 200)
        response3=client3.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        self.assertEqual(response3.status_code,201)
        # now get matched
        response=client.get('/matching/group/get/')
        self.assertEqual(response.status_code,200)

    def test_group_stop(self):
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        # when try to stop no exist matching
        response=client.delete('/matching/group/stop/')
        self.assertEqual(response.status_code,404)

        # successfully stop matching
        response=client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        response=client.delete('/matching/group/stop/')
        self.assertEqual(response.status_code,200)

        # when try to stop already matched matching
        client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        client2.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        client3=Client()
        client3.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'pw3'}),
                     content_type='application/json')
        client3.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        response=client.delete('/matching/group/stop/')
        self.assertEqual(response.status_code,403)

    def test_group_end(self):
        client=Client()
        client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'pw1'}),
                     content_type='application/json')
        # when try to end no exist matching
        response=client.post('/matching/group/end/')
        self.assertEqual(response.status_code,404)

        # successfully ended
        client.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        client2.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        client3=Client()
        client3.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'pw3'}),
                     content_type='application/json')
        client3.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        response=client.post('/matching/group/end/')
        self.assertEqual(response.status_code,200)

    def test_check_condition_match_exactly_same(self):
        queue=GroupMatchingQueue()
        queue.save()
        user1=User.objects.get(username="user1")
        user2=User.objects.get(username="user2")
        entity1=GroupMatchingEntity(queue=queue,user=user1,time='1230',menu='menu1',num='34',matched_opponents=[], time_matching=datetime.now())
        entity1.save()
        entity2=GroupMatchingEntity(queue=queue,user=user2,time='1230',menu='menu1',num='56',matched_opponents=[], time_matching=datetime.now())
        entity2.save()
        entity3=GroupMatchingEntity(queue=queue,user=user1,time='1230',menu='menu2',num='34',matched_opponents=[], time_matching=datetime.now())
        entity3.save()
        entity4=GroupMatchingEntity(queue=queue,user=user2,time='1300',menu='menu1',num='56',matched_opponents=[], time_matching=datetime.now())
        entity4.save()
        response=queue.check_condition_match_exactly_same(entity1,entity2)
        self.assertEqual(response,False)
        response=queue.check_condition_match_exactly_same(entity1,entity3)
        self.assertEqual(response,False)
        response=queue.check_condition_match_exactly_same(entity2,entity4)
        self.assertEqual(response,False)
        entity4.matched=True
        entity4.save()
        response=queue.check_condition_match_exactly_same(entity2,entity4)
        self.assertEqual(response,False)

    def test_remove_entity(self):
        client2=Client()
        client2.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'pw2'}),
                     content_type='application/json')
        client2.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        client3=Client()
        client3.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'pw3'}),
                     content_type='application/json')
        client3.post('/matching/group/start/', json.dumps({'condition':{'time':'1230','menu':'menu1','num':'34'}}),
         content_type='application/json')
        response2=client2.delete('/matching/group/stop/')
        self.assertEqual(response2.status_code,200)