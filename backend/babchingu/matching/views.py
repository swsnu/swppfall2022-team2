from http.client import HTTPResponse
from django.http import HttpResponse

def index(request):
    return HttpResponse("hello")

def start(request):# matching/start/
    #TODO: matching entity to matching queue?
    #and how to response when matching is done?
    return HttpResponse("start matching")
