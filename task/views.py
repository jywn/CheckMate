from django.http import JsonResponse
from core.models import Task
from core.models import SubTask

def display_subtasks(request, task_id):
    sub_tasks = SubTask.objects.filter(task_id=task_id)
    # @response the list of subtasks
    return JsonResponse({'task_id': task_id})

def complete_subtask(request, task_id, subtask_id):
    sub_task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    #@ response the result of completion in HTTP CODE
    return JsonResponse({'task_id': task_id, 'subtask_id': subtask_id})

