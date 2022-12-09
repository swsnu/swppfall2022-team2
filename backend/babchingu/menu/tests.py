from django.test import TestCase, Client
from django.contrib.auth.models import User
from mypage.models import UserInfo
import json
from .models import TodayMenu
from rest_framework.authtoken.models import Token
# Create your tests here.

class ChatTestCase(TestCase):
    def setUp(self):
        #menus
        meal1 = TodayMenu(mealtype="breakfast", menuplace="school", menuname="soup", menuprice="3500", menuextra="")
        meal1.save()

    def test_menu(self):
        client = Client()
        response = client.post('/menu/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
        response = client.get('/menu/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), '[{"mealtype": "breakfast", "menuplace": "school", "menuname": "soup", "menuprice": "3500", "menuextra": ""}]')