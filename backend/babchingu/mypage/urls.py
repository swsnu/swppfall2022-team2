from django.urls import path

from . import views

urlpatterns=[
    path('',views.index),
    path('submit/',views.mypage_submit),
    path('temp/<int:user_id>/',views.touch_temp),
    path('get/',views.mypage_get),
    path('block/',views.mypage_block),
    path('unblock/',views.mypage_unblock),
]