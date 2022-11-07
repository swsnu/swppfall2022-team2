from django.urls import path

from . import views

urlpatterns=[
    path('',views.index),
    path('start/',views.start),
    path('check/<int:id>/',views.check_matched),
    path('get/',views.get_matching),
]