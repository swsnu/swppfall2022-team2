from http.client import HTTPResponse
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt
def index(request):
    return HttpResponse("hello")

@csrf_exempt
def start(request):# matching/start/
    #TODO: matching entity to matching queue?
    #and how to response when matching is done?
    if(request.method=='POST'):
        data=json.loads(request.body.decode())
        condition=data['condition']
        return JsonResponse(condition)
    else:
        return HttpResponseNotAllowed(['POST'])
