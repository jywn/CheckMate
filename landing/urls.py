from django.contrib import admin
from django.urls import path, include

from landing import views

urlpatterns = [
    path('create_task/', views.create_task, name='create_task'),
]
