from django.db import models
from django.contrib.auth.models import User  # Django의 기본 User 모델 사용

class Task(models.Model):
    # 사용자 ID, Django의 기본 User 모델과 연결
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

    # Task ID는 자동으로 증가하는 primary key로 설정하므로 따로 정의하지 않음
    # 상태 필드
    STATUS_CHOICES = [
        ('WILL'),
        ('DOING'),
        ('DONE'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    # 줄글과 제목
    description = models.TextField(blank=True, null=True)  # 줄 글, 빈 값 허용
    title = models.CharField(max_length=255)  # 제목

    # 리뷰와 점수
    review = models.TextField(blank=True, null=True)  # 줄 글, 빈 값 허용
    score = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)  # 0-5 점수

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
        ('DOING'),
        ('DONE'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    # 제목
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.status}"