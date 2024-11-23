from django.contrib import admin
from django.urls import path, include
from task import views

urlpatterns = [
    # main page of the task
    path('<int:user_id>/', views.display_tasks, name='display_tasks'),
    # display subtasks
    path('<int:user_id>/<int:task_id>/', views.display_subtasks, name='display_subtasks'),
    # complete subtask
    path('<int:user_id>/<int:task_id>/<int:subtask_id>/complete/', views.complete_subtask, name='complete_subtask'),
    path('<int:user_id>/<int:task_id>/delete/', views.delete_task, name='delete_task'),
]
