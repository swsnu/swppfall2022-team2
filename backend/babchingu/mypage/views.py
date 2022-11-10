import json
from django.http import HttpResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from mypage.models import UserInfo

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