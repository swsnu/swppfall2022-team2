from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chatroom/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
    #re_path(r"ws/chat/chatroom/1/", consumers.ChatConsumer.as_asgi()),
]