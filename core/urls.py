from django.urls import path

from core.views import NotePadAPIView

urlpatterns = [
    # main page of the task
    path('', NotePadAPIView.as_view(), name='note_pad_api'),
]
