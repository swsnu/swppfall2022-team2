from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User



class Chatroom(models.Model):
    chatuser1 = models.IntegerField(default=0)
    chatuser2 = models.IntegerField(default=0)
    chatnumbers = models.IntegerField(default=0)
    chatusers = models.ManyToManyField(
        User,
        related_name = 'chatroom_with_this_user'
    )


class Message(models.Model):
    order = models.IntegerField()
    chatroom = models.ForeignKey(
        Chatroom,
        #if chatroom is deleted we delete the messages
        on_delete = models.CASCADE,
        related_name = 'message_in_this_chat_room'
    )
    
    author = models.IntegerField()

    content = models.TextField()
    date = models.DateTimeField(default=now, editable=False)