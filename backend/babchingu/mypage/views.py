import json
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse, HttpResponseForbidden, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from mypage.models import UserInfo
from django.contrib.auth.models import User

def index(request):
    return HttpResponse('Default Page')

@login_required
def mypage_submit(request):# mypage/submit/
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        user=request.user
        user_info=user.userinfo
        user_info.mbti=data['mbti']
        user_info.gender=data['gender']
        user_info.name=data['name']
        user_info.intro=data['intro']
        user_info.birth=data['birth']
        user_info.age=(123 - int(user_info.birth)//10000)%100
        user_info.nickname=data['nickname']
        user_info.save()
        return HttpResponse(status=200)

    else:
        return HttpResponseNotAllowed(['POST'])

#POST, GET
def touch_temp(request, user_id): 
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except: # no user with the id
            return HttpResponseNotFound()

        user_info = user.userinfo
        temp = user_info.temperature
        eval_num = user_info.evaluation_num
        return JsonResponse({"id":user.id, "temp":temp, "eval_num":eval_num})


    elif request.method == 'POST':
        try:
            user = User.objects.get(id=user_id)
        except: # no user with the id
            return HttpResponseNotFound()

        #now check if the user.id is in the request.user.userinfo.unevaluated user
        req_userinfo = request.user.userinfo

        if user.id not in req_userinfo.unevaluated_users:
            return HttpResponse(status=204)
        else:
            user_info = user.userinfo
            old_temp = user_info.temperature
            old_eval_num = user_info.evaluation_num

            body = request.body.decode()
            eval = json.loads(body)['eval']

            if eval == "최고":
                new_temp = ((old_eval_num*old_temp)+100)/(old_eval_num+1)
            elif eval == "좋음":
                new_temp = ((old_eval_num*old_temp)+68)/(old_eval_num+1)
            elif eval == "보통":
                new_temp = ((old_eval_num*old_temp)+36.5)/(old_eval_num+1)
            elif eval == "별로":
                new_temp = ((old_eval_num*old_temp)+0)/(old_eval_num+1)
            else:
                new_temp = ((old_eval_num*old_temp)-36)/(old_eval_num+1)

            user_info.temperature = new_temp
            user_info.evaluation_num = old_eval_num + 1
            req_userinfo.unevaluated_users = list(filter(lambda x: x!=user.id, req_userinfo.unevaluated_users))
            req_userinfo.save()
            user_info.save()
            return JsonResponse({"id":user.id, "new_temp":user_info.temperature, "new_eval_num":user_info.evaluation_num})
    else:
        return HttpResponseNotAllowed(['POST', 'GET'])

@login_required
def mypage_get(request):# mypage/get/
    if(request.method=='GET'):
        user=request.user
        user_info=user.userinfo
        response_dict = {'mbti': user_info.mbti, 'gender': user_info.gender, 'name':user_info.name, \
            'temperature':user_info.temperature, 'intro':user_info.intro, 'birth':user_info.birth, \
            'nickname':user_info.nickname, \
            'blocked_users':[User.objects.get(id=blocked_user).userinfo.nickname for blocked_user in user_info.blocked_users], \
            'matched_users':[User.objects.get(id=matched_users).userinfo.nickname for matched_users in user_info.matched_users],}
        if user_info.nickname in response_dict['matched_users'].keys():
            del response_dict['matched_users'][user_info.nickname]
        return JsonResponse(response_dict)
    else:
        return HttpResponseNotAllowed(['GET'])

@login_required
def mypage_block(request):# mypage/block/
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        user=request.user
        user_info=user.userinfo
        nickname = data['nickname']
        temp_user = UserInfo.objects.get(nickname=nickname).user.id
        user_info.blocked_users.append(temp_user)
        user_info.matched_users.remove(temp_user)
        user_info.save()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

@login_required
def mypage_unblock(request):# mypage/unblock/
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        user=request.user
        user_info=user.userinfo
        nickname = data['nickname']
        temp_user = UserInfo.objects.get(nickname=nickname).user.id
        user_info.matched_users.append(temp_user)
        user_info.blocked_users.remove(temp_user)
        user_info.save()
        return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(['POST'])

def nickname_duplication_check(request):# mypage/nick/
    if(request.method=='POST'):
        try:
            user=request.user
            user_info=user.userinfo
            nick = user_info.nickname
        except:
            nick = ''
        data=json.loads(request.body.decode())
        response_dict = {'dup':nick!=data['nickname'] and UserInfo.objects.filter(nickname=data['nickname']).exists()}
        return JsonResponse(response_dict)
    else:
        return HttpResponseNotAllowed(['POST'])

def id_duplication_check(request):# mypage/id/
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        response_dict = {'dup':User.objects.filter(username=data['username']).exists()}
        return JsonResponse(response_dict)
    else:
        return HttpResponseNotAllowed(['POST'])