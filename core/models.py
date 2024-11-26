from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    # essential
    task_id = models.AutoField(primary_key=True)
    date = models.DateTimeField(null=False) # extract
    reminder = models.BooleanField(default=False)

    # allowed
    people = models.CharField(max_length=255, blank=True, null=True) # extract
    location = models.CharField(max_length=255, blank=True, null=True) # extract
    title = models.CharField(max_length=255, blank=True, null=True)  # extract
    importance = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)

    # in dash_board
    description = models.TextField(blank=True, null=True)

    # in review
    review = models.TextField(blank=True, null=True)
    score = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)

    STATUS_CHOICES = [
        ('WILL', 'Will'),
         ('DOING', 'Doing'),
         ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    # for dashboard
    created_at = models.DateTimeField(auto_now_add=True)  # 행이 추가된 시간을 자동 저장

    def __str__(self):
        return f"{self.title} - {self.status}"


class SubTask(models.Model):
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    subtask_id = models.AutoField(primary_key=True)
    STATUS_CHOICES = [
        ('WILL', 'Will'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')
    title = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.title} - {self.status}"