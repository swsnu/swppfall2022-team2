from django.urls import path

from . import views

urlpatterns=[
    path('start/',views.start),
    path('check/<int:id>/',views.check_matched),
    path('get/',views.get_matching),
    path('group/start/',views.group_start),
    path('group/check/<int:id>/',views.group_check_matched),
    path('group/get/',views.group_get_matching),
    path('stop/',views.stop_matching),
    path('group/stop/',views.group_stop_matching),
    path('end/',views.end_matching),
    path('group/end/',views.group_end_matching),
]