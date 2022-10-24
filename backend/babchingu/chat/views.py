from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse, HttpResponseForbidden, HttpResponseNotFound
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from chat.models import Chatroom, Message
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from json.decoder import JSONDecodeError

# Create your views here.

@csrf_exempt
def index(request):
    return HttpResponse('Chat service!')

#POST
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

#POST
@csrf_exempt
def signin(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            #change the login status
            login(request, user)
            return JsonResponse({"id":request.user.id,"username":request.user.username},status=204)
        else: # wrong username, password
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

#GET
@csrf_exempt
def signout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else: # not signed in
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


#GET : user list
@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user_all_list = [{"id": user["id"], "username": user["username"] } for user in User.objects.all().values()]
            return JsonResponse(user_all_list, safe=False)
        else: # not signed in
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


#GET, DELETE : 
@csrf_exempt
def user_info(request, user_id):
    if request.method == 'GET':
        #return the user's chatrooms id
        if request.user.is_authenticated:
            try:
                user = User.objects.get(id=user_id)
            except: # no user with the id
                return HttpResponseNotFound()
            #if there is the user, return the chatroom ids
            chatroomQuery = user.chatroom_with_this_user.values()
            chatroom_list = []
            for chatroom_entry in chatroomQuery:
                chatroom=Chatroom.objects.get(id=chatroom_entry["id"])
                user1 = chatroom.chatuser1
                user2 = chatroom.chatuser2
                if(user.id==user1):
                    chatroom_list.append({"id": chatroom.id, "opponent_id": user2})
                else:
                    chatroom_list.append({"id": chatroom.id, "opponent_id": user1})
            return JsonResponse(chatroom_list, safe=False)
        else: # not signed in
            return HttpResponse(status=401)


    elif request.method == 'DELETE':
        # delete user
        if request.user.is_authenticated:
            try:
                user = User.objects.get(id=user_id)
            except: # no user with id
                return HttpResponseNotFound()
            #if there is the user check if the user is current user
            if user.id != request.user.id:
                return HttpResponseForbidden()
            user.delete()
            return HttpResponse(status=200)
        else: # not signed in
            return HttpResponse(status=401)   
    else:
        return HttpResponseNotAllowed(['GET', 'DELETE'])


#POST
@csrf_exempt
def post_chatroom(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                #get the two user ids and put it in new chatroom object
                body = request.body.decode()
                twousers = json.loads(body)['users'] # this should be list
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()

            # call the user by the ids in the list 
            try:
                user1 = User.objects.get(id=twousers[0])
                user2 = User.objects.get(id=twousers[1])
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()

            new_chatroom = Chatroom(chatuser1=user1.id, chatuser2=user2.id)
            new_chatroom.save()
            new_chatroom.chatusers.add(user1, user2)
            new_chatroom.save()
            return HttpResponse(status=200)

        else: # not signed in
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


#GET, DELETE, POST
@csrf_exempt
def chatroom_info(request, chatroom_id):
    if request.method == 'GET':
        # get chats using the chatnumbers
        if request.user.is_authenticated:
            #check if there exists the chatroom
            try:
                chatroom = Chatroom.objects.get(id=chatroom_id)
            except: 
                return HttpResponseNotFound()
            chatQuery = chatroom.message_in_this_chat_room.values()
            chatlist =  [{"id": chat_entry["id"], "order": chat_entry["order"], "author": chat_entry["author"], "content": chat_entry["content"], "date": chat_entry["date"] } for chat_entry in chatQuery]
            return JsonResponse(chatlist, status=200, safe=False)
        else: # not signed in
            return HttpResponse(status=401)


    elif request.method == 'POST': 
        # need to check if chatroom exists
        if request.user.is_authenticated:
            try:
                chatroom = Chatroom.objects.get(id=chatroom_id)
            except: 
                return HttpResponseNotFound()
            #increase the chatnumbers
            chatroom.chatnumbers = chatroom.chatnumbers+1
            chatroom.save()
            # { content, author_id }
            try:
                body = request.body.decode()
                author_id = json.loads(body)['author_id']
                content = json.loads(body)['content']
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()

            if author_id != request.user.id:
                return HttpResponseForbidden()
            message_author = User.objects.get(id=author_id)
            
            new_message = Message(order=chatroom.chatnumbers, content=content, author=author_id)
            new_message.chatroom = chatroom
            #update the article
            new_message.save()

            return JsonResponse({"id":new_message.id, "content": new_message.content, "author": author_id, "order": new_message.order, "date": new_message.date}, status=200)

        else: # not signed in
            return HttpResponse(status=401)


    elif request.method == 'DELETE':
         # need to check if user is the author 
        if request.user.is_authenticated:
            try:
                chatroom = Chatroom.objects.get(id=chatroom_id)
            except: # no article with the id
                return HttpResponseNotFound()
            #if there is the chatroom, delete the chatroom
            if request.user.id== chatroom.chatuser1 or request.user.id==chatroom.chatuser2:
                chatroom.delete()
                return HttpResponse(status=200)
            else:
                return HttpResponseForbidden()
        else: # not signed in
            return HttpResponse(status=401)   
    else:
        return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])


#DELETE
@csrf_exempt
def chat_info(request, chatroom_id, chat_id):
    if request.method == 'DELETE':
        if request.user.is_authenticated:
            #check if chatroom exists
            try:
                chatroom = Chatroom.objects.get(id=chatroom_id)
            except: 
                return HttpResponseNotFound()
            # check if chat with id exists
            try:
                chat = Message.objects.get(id=chat_id)
            except:
                return HttpResponseNotFound()
            chat.delete()
            return HttpResponse(status=200)

        else: # not signed in
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])




@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
