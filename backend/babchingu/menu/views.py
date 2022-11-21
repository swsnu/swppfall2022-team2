from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse, HttpResponseForbidden, HttpResponseNotFound
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from menu.models import TodayMenu
from menu.cron import crontab_every_hour
from json.decoder import JSONDecodeError

# Create your views here.

@csrf_exempt
def menu(request):
    if request.method == 'GET':
        #crontab_every_hour()
        menu_list = [{"mealtype": menu["mealtype"], "menuplace": menu["menuplace"], "menuname":menu["menuname"], "menuprice":menu["menuprice"], "menuextra":menu["menuextra"] } for menu in TodayMenu.objects.all().values()]
        return JsonResponse(menu_list, safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])
