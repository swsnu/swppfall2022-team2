from http.client import HTTPResponse
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MatchingEntity, MatchingQueue
from django.contrib.auth.models import User
def index(request):
    return HttpResponse("hello")

@csrf_exempt
def start(request):# matching/start/
    #TODO: matching entity to matching queue?
    #and how to response when matching is done?
    if(request.method=='POST'):
        if not MatchingQueue.objects.all().exists():#check queue is initialized
            queue=MatchingQueue(num_matching=0)
            queue.save()
        queue=MatchingQueue.objects.all()[0]
        data=json.loads(request.body.decode())
        condition=data['condition']
        time=condition['time']
        space=condition['space']
        mbti=condition['mbti']
        gender=condition['gender']
        age=condition['age']
        if time is None:
            time=0
        if space is None:
            space=""
        if mbti is None:
            mbti=json.dumps({})
        if gender is None:
            gender=""
        if age is None:
            age_from=0
            age_to=100
        else:
            age_from=age['from']
            age_to=age['to']
        if not User.objects.all().exists():
            user=User.objects.create_user(username="test")#this should be changed to request.user
        else: 
            user=User.objects.all()[0]#this should be changed to request.user
        entity=MatchingEntity(user=user, user_mbti="",user_gender="M",user_age=20,
            time=time, space=space, mbti_wanted=mbti, gender_wanted=gender, 
            age_wanted_from=age_from, age_wanted_to=age_to, queue=queue)
        entity.save()
        queue.match()
        return HttpResponse(status=201)
        #return JsonResponse(json.dumps({"num":num}), safe=False)
        # return JsonResponse(condition)
    else:
        return HttpResponseNotAllowed(['POST'])

@csrf_exempt
def check_matched(request):
    if request.method=='GET':
        #currently, we don't know who the user is.
        #so make this show the matched entity regardless of who have requested
        if not MatchingQueue.objects.all().exists():
            return HttpResponse(status=204)#no matching requested yet
        queue=MatchingQueue.objects.all()[0]
        lst=[]
        for entity in queue.entities.all():
            if entity.matched_opponent is not None:
                lst.append(entity.id)
        return JsonResponse(lst, safe=False)#currently return the id of entity