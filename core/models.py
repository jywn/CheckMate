from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    # 사용자 ID, Django의 기본 User 모델과 연결
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

    # 상태 필드
    STATUS_CHOICES = [
        'WILL',
        'DOING',
        'DONE',
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    # 줄글과 제목
    description = models.TextField(blank=True, null=True)  # 줄 글, 빈 값 허용
    title = models.CharField(max_length=255)  # 제목

    # 리뷰와 점수
    review = models.TextField(blank=True, null=True)  # 줄 글, 빈 값 허용
    score = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)  # 0-5 점수

    # 새로운 필드 추가
    time = models.TimeField(null=False)  # 시간 필드, null 불가
    reminder = models.BooleanField(default=False)  # 리마인더 필드, YES 또는 NO
    people = models.CharField(max_length=255, blank=True, null=True)  # 인물 필드
    type = models.CharField(max_length=100, blank=True, null=True)  # 종류 필드
    importance = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)  # 중요도, 0-5
    place = models.CharField(max_length=255, blank=True, null=True)  # 장소 필드
    tags = models.CharField(max_length=255, blank=True, null=True)  # 태그 필드

    def __str__(self):
        return f"{self.title} - {self.status}"


class SubTask(models.Model):
    # 사용자 ID와 Task ID와 연결
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subtasks')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')

    # SubTask ID는 자동 primary key
    # 상태 필드
    STATUS_CHOICES = [
        ('WILL'),
        ('DONE'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    # 제목
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.status}"