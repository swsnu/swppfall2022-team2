from http.client import HTTPResponse
import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MatchingEntity, MatchingQueue
from django.contrib.auth.models import User
from datetime import datetime
def index(request):
    return HttpResponse("hello")

@csrf_exempt
def start(request):# matching/start/
    if(request.method=='POST'):
        if not MatchingQueue.objects.all().exists():#check queue is initialized
            queue=MatchingQueue()
            queue.save()
        queue=MatchingQueue.objects.all()[0]
        data=json.loads(request.body.decode())
        condition=data['condition']
        time=condition['time']
        space=condition['space']
        mbti=condition['mbti']
        gender=condition['gender']
        age=condition['age']
        age_from=age['from']
        age_to=age['to']
        user_info=request.user.userinfo
        entity=MatchingEntity(user=request.user, user_mbti=user_info.mbti,user_gender=user_info.gender,
            user_age=user_info.age,time=time, space=space, mbti_wanted=mbti, gender_wanted=gender, 
            age_wanted_from=age_from, age_wanted_to=age_to, queue=queue, time_matching=datetime.now())
            # currently the user's mbti, gender, age is fixed.
            # after implementing other features, this should be changed
        entity.save()
        queue.match_adapt()
        response_dict={'id':entity.id, 'num_matching':queue.num_matching()}
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

@csrf_exempt
def check_matched(request, id):
    if request.method=='GET':
        if not MatchingQueue.objects.all().exists():
            return HttpResponse(status=404)# no matching requested yet
        queue=MatchingQueue.objects.all()[0]
        queue.match_adapt() # remove this if not needed, but I think this is needed
        try:            
            entity=MatchingEntity.objects.get(id=id)
        except MatchingEntity.DoesNotExist:
            return HttpResponse(status=404) # if such entity not exist
        if entity.matched_opponent is None:
            return HttpResponse(status=204)
        opponent=entity.matched_opponent
        response_dic={'time':opponent.time,'space_user':entity.space,'space_opponent':opponent.space,
         'mbti':opponent.user_mbti, 'gender':opponent.user_gender, 'age':opponent.user_age, 'id':opponent.user.id}
        return JsonResponse(response_dic)

@csrf_exempt
def get_matching(request):#when re-logined get previous info
    if request.method=='GET':
        if not MatchingQueue.objects.all().exists():
            return HttpResponse(status=404)# no matching requested yet
        queue=MatchingQueue.objects.all()[0]
        try:
            entity=MatchingEntity.objects.get(user=request.user)
        except MatchingEntity.DoesNotExist:
            return HttpResponse(status=404) # if such entity not exist
        opponent=entity.matched_opponent
        if opponent is None:
            response_dic={'id':entity.id, 'num_matching':queue.num_matching()}
            return JsonResponse(response_dic, status=201)
        response_dic={'time':opponent.time,'space_user':entity.space,'space_opponent':opponent.space,
         'mbti':opponent.user_mbti, 'gender':opponent.user_gender, 'age':opponent.user_age, 'id':opponent.user.id}
        return JsonResponse(response_dic)