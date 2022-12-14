from django.urls import path

from . import views

urlpatterns=[
    path('submit/',views.mypage_submit),
    path('temp/<int:user_id>/',views.touch_temp),
    path('get/',views.mypage_get),
    path('block/',views.mypage_block),
    path('unblock/',views.mypage_unblock),
    path('nick/',views.nickname_duplication_check),
    path('id/',views.id_duplication_check),
]