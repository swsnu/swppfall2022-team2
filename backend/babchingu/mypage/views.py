from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from mypage.models import User
from mypage.forms import UserStatusChange
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.decorators import login_required


def index(request):
    return HttpResponse('Default Page')

@login_required
@csrf_exempt
def mypage_submit(request):# mypage/submit/
    if(request.method=='POST'):
        statusChange = UserStatusChange(data = request.POST,instance = request.user)
        #if statusChange.is_valid():
        statusChange.save()
        return HttpResponse(status=201)

    else:
        return HttpResponseNotAllowed(['POST'])