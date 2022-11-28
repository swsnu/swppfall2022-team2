from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user/', views.user_list, name='user_list'),
    path('user/signup/', views.signup, name='signup'),
    path('user/signin/', views.signin, name='signin'),
    path('user/current/', views.currentuser, name='current'),
    path('user/signout/', views.signout, name='signout'),
    path('user/<int:user_id>/', views.user_info, name='user_info' ),
    path('chatroom/', views.post_chatroom, name='post_chatroom' ),
    path('chatroom/<int:chatroom_id>/', views.chatroom_info, name='chatroom_info' ),
    path('chatroom/<int:chatroom_id>/<int:chat_id>/', views.chat_info, name='chat_info'),
    path('token/', views.token, name='token'),
]