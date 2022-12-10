from django.test import TestCase, Client
from .models import Chatroom, Message
from django.contrib.auth.models import User
from mypage.models import UserInfo
import json
from rest_framework.authtoken.models import Token

class ChatTestCase(TestCase):
    def setUp(self):
        #users
        user1 = User.objects.create_user(username="user1", password="user1")
        user2 = User.objects.create_user(username="user2", password="user2")
        user3 = User.objects.create_user(username="user3", password="user3")
        userinfo1=UserInfo(user=user1)
        userinfo1.mbti='ESTJ'
        userinfo1.gender='M'
        userinfo1.age=22
        userinfo1.nickname="user1nickname"
        userinfo1.save()
        userinfo2=UserInfo(user=user2)
        userinfo2.mbti='ESTJ'
        userinfo2.gender='M'
        userinfo2.age=23
        userinfo2.nickname="user2nickname"
        userinfo2.save()
        userinfo3=UserInfo(user=user3)
        userinfo3.mbti='ESTJ'
        userinfo3.gender='M'
        userinfo3.age=22
        userinfo3.nickname="user3nickname"
        userinfo3.save()
        Token.objects.create(user=user1)
        Token.objects.create(user=user2)
        Token.objects.create(user=user3)

    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/chat/user/signup/', json.dumps({'username': 'user4', 'password': 'user4'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403

        response = client.get('/chat/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/chat/user/signup/', json.dumps({'username': 'user4', 'password': 'user4', 'name':"user4name", "mbti":"ENTJ", "gender": "M", "nickname": "user4nickname", "birth":"970901", "email":"user4@snu.ac.kr" }),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_csrf_other_method(self):
        client = Client()
        response = client.post('/chat/token/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = client.put('/chat/token/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = client.delete('/chat/token/')
        self.assertEqual(response.status_code, 405)

    def test_index(self):
        client = Client()
        response = client.get('/chat/')
        self.assertEqual('Chat service!', response.content.decode())

    def test_signup(self):
        client = Client()
        # right signup method
        response1 = client.post('/chat/user/signup/', json.dumps({'username': 'user4', 'password': 'user4', 'name':"user4name", "mbti":"ENTJ", "gender": "M", "nickname": "user4nickname", "birth":"970901", "email":"user4@snu.ac.kr" }), content_type='application/json')
        self.assertEqual(response1.status_code, 201)
        # wrong method
        response2 = client.get('/chat/user/signup/', content_type='application/json')
        self.assertEqual(response2.status_code, 405)

    def test_signin_correct(self):
        client = Client()
        #right sign in
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_signin_wrong(self):
        client = Client()
        # wrong password
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user2'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        #wrong method
        response = client.get('/chat/user/signin/', content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_signout(self):
        client = Client()
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # right sign out
        response = client.get('/chat/user/signout/')
        self.assertEqual(response.status_code, 204)
        #not signed in
        response = client.get('/chat/user/signout/')
        self.assertEqual(response.status_code, 401)
        #not allowed
        response = client.post('/chat/user/signout/', json.dumps({'username': 'test1', 'password': 'test1'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)


    def test_get_user(self):
        client = Client()
        # wrong method not allowed
        response = client.put('/chat/user/', json.dumps({'username':'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        #not authenticated 
        response = client.get('/chat/user/')
        self.assertEqual(response.status_code, 401)
        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        
        response = client.get('/chat/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual('[{"id": 1, "nickname": "user1nickname"}, {"id": 2, "nickname": "user2nickname"}, {"id": 3, "nickname": "user3nickname"}]', response.content.decode())
        

    def test_user_individual(self):
        client = Client()

        #wrong method
        response = client.post('/chat/user/1/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        #not authenticated
        response = client.get('/chat/user/1/')
        self.assertEqual(response.status_code, 401)

        #signin
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200) 

        #user not found
        response = client.get('/chat/user/5/')
        self.assertEqual(response.status_code, 404)

         #right request
        response = client.get('/chat/user/1/')
        self.assertEqual('[]', response.content.decode())


    def test_post_chatroom(self):
        client = Client()

        #wrong method
        response = client.get('/chat/chatroom/')
        self.assertEqual(response.status_code, 405)

        #not authenticated 
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 2}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # post with wrong field 
        response = client.post('/chat/chatroom/', json.dumps({'content':'chat1'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # post with non existent user
        response = client.post('/chat/chatroom/', json.dumps({'roomtype': "개인", 'users':[3,10]}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # post correctly
        response = client.post('/chat/chatroom/', json.dumps({'roomtype': "개인", 'users':[1,2]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('{"id": 1, "user_id": [2], "name": "user2nickname"}', response.content.decode())

        #get user chatroom
        response = client.get('/chat/user/1/')
        self.assertEqual(response.status_code, 200)

    def test_chatroom_id_get(self):
        client = Client()
        # wrong method not allowed
        response = client.put('/chat/chatroom/1/', json.dumps({'content':'chat'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        #not authenticated 
        response = client.get('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 401)

        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #create chatroom
        response = client.post('/chat/chatroom/', json.dumps({'roomtype': "개인", 'users':[1,2]}), content_type='application/json')
        self.assertIn('{"id": 1, "user_id": [2], "name": "user2nickname"}', response.content.decode())

        #not found
        response = client.get('/chat/chatroom/10/')
        self.assertEqual(response.status_code, 404)

        #found
        response = client.get('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('[]', response.content.decode())


    def test_chatroom_id_post(self):
        client = Client()

        #not authenticated 
        response = client.post('/chat/chatroom/1/', json.dumps({'content': 'hi'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #create chatroom
        response = client.post('/chat/chatroom/', json.dumps({"roomtype":"개인", 'users': [1,2]}), content_type='application/json')
        self.assertIn('{"id": 1, "user_id": [2], "name": "user2nickname"}', response.content.decode())

        #not found
        response = client.post('/chat/chatroom/10/', json.dumps({'content': 'hi'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        #found but bad request
        response = client.post('/chat/chatroom/1/', json.dumps({'title': 'hi'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        #correct
        response = client.post('/chat/chatroom/1/', json.dumps({'content': 'hi'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('"id": 1, "content": "hi", "author": 1, "order": 1', response.content.decode())



    def test_chatroom_id_delete(self):
        client = Client()

        #not authenticated 
        response = client.delete('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 401)

        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #create chatroom
        response = client.post('/chat/chatroom/', json.dumps({"roomtype":"개인", 'users': [1,2]}), content_type='application/json')
        self.assertIn('{"id": 1, "user_id": [2], "name": "user2nickname"}', response.content.decode())

        #not found
        response = client.delete('/chat/chatroom/10/')
        self.assertEqual(response.status_code, 404)

        #correct
        response = client.delete('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 404)

    

    def test_chatroom_chat_id_delete(self):
        client = Client()

        #wrong method
        response = client.get('/chat/chatroom/1/1/')
        self.assertEqual(response.status_code, 405)

        #not authenticated 
        response = client.delete('/chat/chatroom/1/1/')
        self.assertEqual(response.status_code, 401)

        # signin 
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user1', 'password': 'user1'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #create chatroom
        response = client.post('/chat/chatroom/', json.dumps({"roomtype":"개인", 'users': [1,2]}), content_type='application/json')
        self.assertIn('{"id": 1, "user_id": [2], "name": "user2nickname"}', response.content.decode())

        #create chat
        response = client.post('/chat/chatroom/1/', json.dumps({'content': 'hi'}), content_type='application/json')
        self.assertIn('"id": 1, "content": "hi", "author": 1', response.content.decode())

        #not found
        response = client.delete('/chat/chatroom/10/1/')
        self.assertEqual(response.status_code, 404)

        #not found
        response = client.delete('/chat/chatroom/1/3/')
        self.assertEqual(response.status_code, 404)

        #correct delete
        response = client.delete('/chat/chatroom/1/1/')
        self.assertEqual(response.status_code, 200)
        response = client.get('/chat/chatroom/1/')
        self.assertEqual('[]', response.content.decode())