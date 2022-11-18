from django.urls import path

from . import views

urlpatterns=[
    path('start/',views.start),
    path('check/<int:id>/',views.check_matched),
    path('get/',views.get_matching),
    path('group/start/',views.group_start),
    path('group/check/<int:id>/',views.group_check_matched),
]