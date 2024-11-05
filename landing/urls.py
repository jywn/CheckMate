from django.contrib import admin
from django.urls import path, include

from landing import views

urlpatterns = [
    path('input_parser/', views.input_parser, name='input_parser'),
]
