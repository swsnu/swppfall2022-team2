from django.contrib import admin
from .models import MatchingEntity, MatchingQueue

admin.site.register(MatchingQueue)
admin.site.register(MatchingEntity)
