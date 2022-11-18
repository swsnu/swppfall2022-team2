import json
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MatchingEntity, MatchingQueue, GroupMatchingQueue,GroupMatchingEntity
from datetime import datetime

@csrf_exempt
def start(request):# /matching/start/
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
        entity.save()
        queue.match_adapt()
        response_dict={'id':entity.id, 'num_matching':queue.num_matching()}
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

@csrf_exempt
def check_matched(request, id):# /matching/check/<int:id>/
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
         'mbti':opponent.user_mbti, 'gender':opponent.user_gender, 'age':opponent.user_age,
          'id':opponent.user.id,'first_name':opponent.user.userinfo.first_name, 'last_name':opponent.user.userinfo.last_name}
        return JsonResponse(response_dic)

@csrf_exempt
def get_matching(request): # /matching/get/
    #when re-logined get previous info
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
         'mbti':opponent.user_mbti, 'gender':opponent.user_gender, 'age':opponent.user_age, 
         'id':opponent.user.id, 'first_name':opponent.user.userinfo.first_name, 'last_name':opponent.user.userinfo.last_name}
        return JsonResponse(response_dic)



@csrf_exempt
def group_start(request):# /matching/group/start/
    if(request.method=='POST'):
        if not GroupMatchingQueue.objects.all().exists():#check queue is initialized
            queue=GroupMatchingQueue()
            queue.save()
        queue=GroupMatchingQueue.objects.all()[0]
        data=json.loads(request.body.decode())
        condition=data['condition']
        time=condition['time']
        menu=condition['menu']
        num=condition['num']
        entity=GroupMatchingEntity(user=request.user, time=time, menu=menu, num=num, queue=queue, matched_opponents=[], time_matching=datetime.now())
        entity.save()
        queue.match_exactly_same()
        response_dict={'id':entity.id, 'num_matching':queue.num_matching()}
        return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

        
@csrf_exempt
def group_check_matched(request, id):# /matching/group/check/<int:id>/
    if request.method=='GET': 
        if not GroupMatchingQueue.objects.all().exists():
            return HttpResponse(status=404)# no matching requested yet
        # queue.match_adapt() # in group matching, condition adapting by time do not applied so not need this currently
        try:            
            entity=GroupMatchingEntity.objects.get(id=id)
        except GroupMatchingEntity.DoesNotExist:
            return HttpResponse(status=404) # if such entity not exist
        if entity.matched==False:
            return HttpResponse(status=204)
        opponents=entity.matched_opponents
        response_dic={'time':entity.time,'menu':entity.menu,
        'opponents':[{'id':GroupMatchingEntity.objects.get(id=opponent).user.id,
        'name':GroupMatchingEntity.objects.get(id=opponent).user.userinfo.last_name+GroupMatchingEntity.objects.get(id=opponent).user.userinfo.first_name}for opponent in opponents]}
        return JsonResponse(response_dic)