from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    user_idx = models.IntegerField(default=1)  # 정수형 user_id 필드 추가
    # input includes
    # essential
    time = models.TimeField(null=False)
    reminder = models.BooleanField(default=False) # ask user to remind or not
    # allowed
    people = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    importance = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)
    place = models.CharField(max_length=255, blank=True, null=True)

    description = models.TextField(blank=True, null=True)
    # paraphrase by GPT?
    title = models.CharField(max_length=255, blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)

    # review
    review = models.TextField(blank=True, null=True)
    score = models.IntegerField(choices=[(i, i) for i in range(6)], default=0)

    STATUS_CHOICES = [
        ('WILL', 'Will'),
         ('DOING', 'Doing'),
         ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')

    def __str__(self):
        return f"{self.title} - {self.status}"


class SubTask(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subtasks')
    user_idx = models.IntegerField(default=1)  # Task의 user_idx와 일치시키기 위해 추가
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    STATUS_CHOICES = [
        ('WILL', 'Will'),
        ('DONE', 'Done'),
    ]

    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')
    title = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # Task의 user_idx를 SubTask의 user_idx에 자동 할당
        if self.task:
            self.user_idx = self.task.user_idx
        super(SubTask, self).save(*args, **kwargs)
    def __str__(self):
        return f"{self.title} - {self.status}"