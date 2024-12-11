from rest_framework import serializers
from core.models import Task, SubTask, NotePad, File


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_id', 'date', 'reminder', 'people', 'location', 'title', 'importance', 'description', 'review', 'score', 'status', 'created_at']

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = '__all__'

class NotePadSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotePad
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskFile
        fields = '__all__'