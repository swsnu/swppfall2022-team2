from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return HttpResponse('Default Page')

@csrf_exempt
def mypage_main(request):
    pass