from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth import get_user_model

class UserStatusChange(UserChangeForm):
    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'first_name', 'last_name', 'temperature', 'mbti', 'gender', 'intro', 'age']
