from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

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
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    STATUS_CHOICES = [
        ('WILL', 'Will'),
        ('DONE', 'Done'),
    ]
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default='WILL')
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} - {self.status}"