from django.urls import path
from task import views

urlpatterns = [
    # main page of the task
    path('', views.display_tasks, name='display_tasks'),
    # display subtasks
    path('<int:task_id>/', views.display_task, name='display_task'),
    path('<int:task_id>/delete/', views.delete_task, name='delete_task'),
    path('<int:task_id>/update/', views.update_task, name='update_task'),
    path('<int:task_id>/add/', views.add_subtask, name='add_subtask'),
    path('<int:task_id>/subtask/', views.display_subtasks, name='display_subtasks'),
    path('<int:task_id>/subtask/<int:subtask_id>/', views.display_subtask, name='display_subtask'),
    path('<int:task_id>/subtask/<int:subtask_id>/update/', views.update_subtask, name='update_subtask'),
    # complete subtask
    path('<int:task_id>/subtask/<int:subtask_id>/delete/', views.delete_subtask, name='delete_subtask'),
]
