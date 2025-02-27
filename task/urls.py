from django.urls import path
from task import views
from task.views import TaskDetailAPIView, TaskListCreateAPIView, SubTaskListCreateAPIView, SubTaskDetailAPIView, \
    FileListUploadAPIView, FileDetailAPIView

urlpatterns = [
    # main page of the task
    path('', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('<int:task_id>/', TaskDetailAPIView.as_view(), name='task-detail'),
    path('<int:task_id>/subtask/', SubTaskListCreateAPIView.as_view(), name='subtask-list-create'),
    path('<int:task_id>/subtask/<int:subtask_id>/', SubTaskDetailAPIView.as_view(), name='subtask-detail'),
    path('<int:task_id>/file/', FileListUploadAPIView.as_view(), name='file-list-upload'),
    path('<int:task_id>/file/<int:file_id>/', FileDetailAPIView.as_view(), name='file-detail'),
    path('recently_added/', views.display_recently_added, name='recently-added'),
    path('in_progress', views.display_in_progress, name='in-progress'),
    path('reviews', views.display_reviews, name='reviews'),
]
