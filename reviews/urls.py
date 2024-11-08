from django.contrib import admin
from django.urls import path, include
from task import views

urlpatterns = [
    # main page of the reviews
    path('', ),
]
urlpatterns = [
    # main page of the task
    path('', ),
    path('<int:user/id>/', views.display_tasks, name='display_tasks'),
    # display subtasks
    path('<int:user_id>/<int:task_id>/', views.display_subtasks, name='display_subtasks'),
    # complete subtask
    path('<int:user_id>/<int:task_id>/<int:subtask_id>/complete', views.complete_subtask, name='complete_subtask'),
    # display reviews
    path('<int:user/id>/reviews/', views.display_reviews, name='display_reviews'),
    # display review subtasks
    path('<int:user_id>/<int:task_id>/', views.display_subtasks, name='display_subtasks'),
    # add rating and review for a task
    path('<int:user_id>/<int:task_id>/review/', views.add_review, name='add_review'),
    # complete subtask
    path('<int:user_id>/<int:task_id>/<int:subtask_id>/complete', views.complete_subtask, name='complete_subtask'),


]