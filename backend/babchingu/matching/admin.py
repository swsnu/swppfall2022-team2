''' module docstring error'''
from django.contrib import admin
from .models import MatchingEntity, MatchingQueue, GroupMatchingEntity, GroupMatchingQueue

admin.site.register(MatchingQueue)
admin.site.register(MatchingEntity)
admin.site.register(GroupMatchingQueue)
admin.site.register(GroupMatchingEntity)
