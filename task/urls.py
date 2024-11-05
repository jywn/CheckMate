from django.contrib import admin
from django.urls import path, include
from task import views

urlpatterns = [
    # main page of the task
    path('', ),
    # display subtasks
    path('<int:task_id>/', views.display_subtasks, name='display_subtasks'),
    # complete subtask
    path('<int:task_id>/<int:subtask_id>/complete', views.complete_subtask, name='complete_subtask'),
]
