from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse, HttpResponseForbidden, HttpResponseNotFound
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from chat.models import Chatroom, Message
from mypage.models import UserInfo
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
        name = req_data['name']
        mbti = req_data['mbti']
        gender = req_data['gender']
        nickname = req_data['nickname']
        birth = req_data['birth']
        age=(123 - int(birth)//10000)%100
        email = req_data['email']
        user=User.objects.create_user(username=username, password=password)
        userinfo=UserInfo(user=user, name=name, mbti=mbti, gender=gender, nickname=nickname, birth=birth, email=email, age=age)
        userinfo.save()
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
            return JsonResponse({"id":request.user.id,"nickname":request.user.userinfo.nickname})
        else: # wrong username, password
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])

#GET
@csrf_exempt
def currentuser(request):
    if request.method == 'GET':
        return JsonResponse({"id":request.user.id,"nickname":request.user.userinfo.nickname})
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
            user_all_list = []
            user_set = User.objects.all()
            for user in user_set.iterator():
                user_info = user.userinfo
                user_all_list.append({"id": user.id, "nickname": user_info.nickname})
            return JsonResponse(user_all_list, safe=False)
        else: # not signed in
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])


#GET : 
@csrf_exempt
def user_info(request, user_id):
    if request.method == 'GET':
        #return the user's chatrooms id & opponent & last chat in that chatroom
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
                user_query = chatroom.chatusers.exclude(id=request.user.id).all()
                messages = chatroom.message_in_this_chat_room.values()
                print(messages)
                if len(messages) ==0:
                    last_message = {}
                else:
                    last_message = messages.latest('order')
                nickname_string = ', '.join([user.userinfo.nickname for user in user_query])
                chatroom_list.append({"id": chatroom.id, "roomtype":chatroom.roomtype, "user_id": [user.id for user in user_query], "name":nickname_string, "last_chat": last_message})
            return JsonResponse(chatroom_list, safe=False)
        else: # not signed in
            return HttpResponse(status=401)  
    else:
        return HttpResponseNotAllowed(['GET'])


#POST
@csrf_exempt
def post_chatroom(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                #get the two user ids and put it in new chatroom object
                body = request.body.decode()
                roomtype = json.loads(body)['roomtype'] # this should be list
                userids = json.loads(body)['users']
            except:
                return HttpResponseBadRequest()

            # treat the chatrooms differently
            userid_list = userids
            if roomtype=="개인":
                try:
                    user1 = User.objects.get(id=userid_list[0])
                    user2 = User.objects.get(id=userid_list[1])
                except:
                    return HttpResponseBadRequest()
                
                new_chatroom = Chatroom(roomtype="개인")
                new_chatroom.save()
                new_chatroom.chatusers.add(user1, user2)
                new_chatroom.save()
                if user1.id==request.user.id:
                    return JsonResponse({"id": new_chatroom.id, "user_id": [user2.id], "name": user2.userinfo.nickname})
                else:
                    return JsonResponse({"id": new_chatroom.id, "user_id": [user1.id], "name": user1.userinfo.nickname})
            else:
                users = []
                try:
                    for userid in userid_list:
                        user = User.objects.get(id=userid)
                        users.append(user)
                except:
                    return HttpResponseBadRequest()
                new_chatroom = Chatroom(roomtype="단체")
                new_chatroom.save()
                for user in users:
                    new_chatroom.chatusers.add(user)
                    new_chatroom.save()
            #return the created chatroom details
                user_query = new_chatroom.chatusers.exclude(id=request.user.id).all()
                nickname_string = ", ".join([user.userinfo.nickname for user in user_query])
                return JsonResponse({"id": new_chatroom.id, "user_id": [user.id for user in user_query], "name": nickname_string})

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
            return JsonResponse(chatlist, safe=False)
        else: # not signed in
            return HttpResponse(status=401)


    elif request.method == 'POST': 
        # need to check if chatroom exists
        if request.user.is_authenticated:
            try:
                chatroom = Chatroom.objects.get(id=chatroom_id)
            except: 
                return HttpResponseNotFound()
            # { content, author_id }
            try:
                body = request.body.decode()
                author_id = request.user.id
                content = json.loads(body)['content']
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
            #increase the chatnumbers
            chatroom.chatnumbers = chatroom.chatnumbers+1
            chatroom.save()
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
            if chatroom.roomtype == "개인":
                chatroom.delete()
                #return the list of chatrooms with this user
                chatroomQuery = request.user.chatroom_with_this_user.values()
                chatroom_list = []
                for chatroom_entry in chatroomQuery:
                    chatroom=Chatroom.objects.get(id=chatroom_entry["id"])
                    user_query = chatroom.chatusers.exclude(id=request.user.id).all()
                    messages = chatroom.message_in_this_chat_room.values()
                    if len(messages) ==0:
                        last_message = {}
                    else:
                        last_message = messages.latest('order')
                    nickname_string = ', '.join([user.userinfo.nickname for user in user_query])
                    chatroom_list.append({"id": chatroom.id, "roomtype":chatroom.roomtype, "user_id": [user.id for user in user_query], "name":nickname_string, "last_chat": last_message})
                return JsonResponse(chatroom_list, safe=False)
            else:
                chatroom.chatusers.remove(request.user)
                chatroom.save()
                #return the list of chatrooms with this user
                chatroomQuery = request.user.chatroom_with_this_user.values()
                chatroom_list = []
                for chatroom_entry in chatroomQuery:
                    chatroom=Chatroom.objects.get(id=chatroom_entry["id"])
                    user_query = chatroom.chatusers.exclude(id=request.user.id).all()
                    messages = chatroom.message_in_this_chat_room.values()
                    if len(messages) ==0:
                        last_message = {}
                    else:
                        last_message = messages.latest('order')
                    nickname_string = ', '.join([user.userinfo.nickname for user in user_query])
                    chatroom_list.append({"id": chatroom.id, "roomtype":chatroom.roomtype, "user_id": [user.id for user in user_query], "name":nickname_string, "last_chat": last_message})
                return JsonResponse(chatroom_list, safe=False)
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
        return HttpResponseNotAllowed(['DELETE'])




@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])
