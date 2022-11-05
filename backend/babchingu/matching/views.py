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
        age_from=age['from']
        age_to=age['to']
        entity=MatchingEntity(user=request.user, user_mbti="INFP",user_gender="M",user_age=22,
            time=time, space=space, mbti_wanted=mbti, gender_wanted=gender, 
            age_wanted_from=age_from, age_wanted_to=age_to, queue=queue)
            # currently the user's mbti, gender, age is fixed.
            # after implementing other features, this should be changed
        entity.save()
        queue.match_exactly_same()
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
        try:            
            entity=MatchingEntity.objects.get(id=id)
        except MatchingEntity.DoesNotExist:
            return HttpResponse(status=404) # if such entity not exist
        if entity.matched_opponent is None:
            return HttpResponse(status=204)
        opponent=entity.matched_opponent
        response_dic={'mbti':opponent.user_mbti, 'gender':opponent.user_gender, 'age':opponent.user_age}
        return JsonResponse(response_dic)