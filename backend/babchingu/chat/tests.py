from django.test import TestCase, Client
from .models import Chatroom, Message
from django.contrib.auth.models import User
import json


class ChatTestCase(TestCase):
    def setUp(self):
        #users
        user1 = User.objects.create_user(username="user1", password="user1")
        user2 = User.objects.create_user(username="user2", password="user2")
        user3 = User.objects.create_user(username="user3", password="user3")
        

    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/chat/user/signup/', json.dumps({'username': 'user4', 'password': 'user4'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)  # Request without csrf token returns 201 for now

        response = client.get('/chat/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/chat/user/signup/', json.dumps({'username': 'user5', 'password': 'user5'}),
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
        response1 = client.post('/chat/user/signup/', json.dumps({'username': 'user4', 'password': 'user4'}), content_type='application/json')
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
        self.assertEqual('[{"id": 1, "username": "user1"}, {"id": 2, "username": "user2"}, {"id": 3, "username": "user3"}]', response.content.decode())
        

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
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 4}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # post correctly
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 3}), content_type='application/json')
        self.assertIn('{"id": 1, "opponent_id": 3}', response.content.decode())

        #get user chatroom
        response = client.get('/chat/user/1/')
        self.assertEqual('[{"id": 1, "opponent_id": 3, "last_chat": {}}]', response.content.decode())


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
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 3}), content_type='application/json')
        self.assertIn('{"id": 1, "opponent_id": 3}', response.content.decode())

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
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 3}), content_type='application/json')
        self.assertIn('{"id": 1, "opponent_id": 3}', response.content.decode())

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
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 3}), content_type='application/json')
        self.assertIn('{"id": 1, "opponent_id": 3}', response.content.decode())

        #not found
        response = client.delete('/chat/chatroom/10/')
        self.assertEqual(response.status_code, 404)

        #sign out and sign in
        response = client.get('/chat/user/signout/')
        self.assertEqual(response.status_code, 204)
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user2', 'password': 'user2'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        #found but forbidden
        response = client.delete('/chat/chatroom/1/')
        self.assertEqual(response.status_code, 403)

        #again sign out and sign in
        response = client.get('/chat/user/signout/')
        self.assertEqual(response.status_code, 204)
        response = client.post('/chat/user/signin/', json.dumps({'username': 'user3', 'password': 'user3'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

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
        response = client.post('/chat/chatroom/', json.dumps({'opponent': 3}), content_type='application/json')
        self.assertIn('{"id": 1, "opponent_id": 3}', response.content.decode())

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