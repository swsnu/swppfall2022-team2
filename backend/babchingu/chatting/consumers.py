import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Message,Chatroom,User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(self.room_name)
        print("채팅 서버에 접속했습니다.")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print("채팅 서버에서 나갔습니다.")

    # Receive message from WebSocket
    async def receive(self, text_data):
            text_data_json = json.loads(text_data)
            data_type = text_data_json['type']
            message = text_data_json['content']
            authorId = text_data_json['author']
            print(authorId)
            

            if data_type == "message" :
                chatroom = Chatroom.objects.get(id = text_data_json['room'])

                messages = Message.objects.create(
                    author = authorId,
                    content = message,
                    order = chatroom.chatnumbers + 1,
                    chatroom = chatroom
                )
                # Send message to room group
                await self.channel_layer.group_send(
                self.room_group_name, 
                {'type': 'chat_message', 'content': messages.content, 'author' : messages.author}
                )

         
    # Receive message from room group
    async def chat_message(self, event):
        message = event["content"]
        author = event["author"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"content" : message, "author" : author}))