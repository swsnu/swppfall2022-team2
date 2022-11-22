import json
from django.http import HttpResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from mypage.models import UserInfo
from django.contrib.auth.models import User

def index(request):
    return HttpResponse('Default Page')

@login_required
@csrf_exempt
def mypage_submit(request):# mypage/submit/
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        user=request.user
        user_info=user.userinfo
        user_info.mbti=data['mbti']
        user_info.gender=data['gender']
        user_info.first_name=data['first_name']
        user_info.last_name=data['last_name']
        user_info.intro=data['intro']
        user_info.age=data['age']
        user_info.save()
        return HttpResponse(status=200)

    else:
        return HttpResponseNotAllowed(['POST'])


#POST, GET
@csrf_exempt
def touch_temp(request, user_id): 
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except: # no user with the id
            return HttpResponseNotFound()

        user_info = user.userinfo
        temp = user_info.temperature
        eval_nam = user_info.evaluation_num

        return JsonResponse({"id":user.id, "temp":temp, "eval_num":eval_num})


    elif request.method == 'POST':
        try:
            user = User.objects.get(id=user_id)
        except: # no user with the id
            return HttpResponseNotFound()

        user_info = user.userinfo
        old_temp = user_info.temperature
        old_eval_nam = user_info.evaluation_num

        body = request.body.decode()
        eval = json.loads(body)['eval']

        if eval == "최고":
            new_temp = ((old_eval_num*old_temp)+100)/(old_eval_num+1)
        elif eval == "좋음":
            new_temp = ((old_eval_num*old_temp)+68)/(old_eval_num+1)
        elif eval == "보통":
            new_temp = ((old_eval_num*old_temp)+36.5)/(old_eval_num+1)
        elif eval == "별로":
            new_temp = ((old_eval_num*old_temp)+18)/(old_eval_num+1)
        else:
            new_temp = ((old_eval_num*old_temp)+0)/(old_eval_num+1)
        
        user_info.temperature = new_temp
        user_info.evaluation_num = old_eval_nam + 1
        user_info.save()
        return JsonResponse({"id":user.id, "new_temp":user_info.temperature})
    else:
        return HttpResponseNotAllowed(['POST', 'GET'])
