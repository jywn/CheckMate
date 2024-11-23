from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import Task
from core.models import SubTask
from core.serializers import TaskSerializer, SubTaskSerializer

# filter vs get_list_or_404
# 자동 예외 처리가 필요한 경우 -> get_*_or_404
# 빈 쿼리일 가능성이 높은 경우 -> filter
# 빈 쿼리여도 error가 아닌 경우 -> filter

@csrf_exempt
@api_view(['GET'])
def display_tasks(request):
    """
    return Tasks as JSON

    :param request: HTTP request object
    :return: Tasks in JSON
    """
    tasks = Task.objects.filter()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_task(request, task_id):
    """
    return Task as JSON

    :param request: HTTP request object
    :param task_id: Task table key (task_id)
    :return: Task in JSON
    """
    tasks = Task.objects.filter(task_id=task_id)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['PATCH'])
def update_task(request, task_id):
    """

    :param request:
    :param task_id:
    :return:
    """
    task = Task.objects.get(task_id=task_id)
    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['DELETE'])
def delete_task(request, task_id):
    """
    delete Task (NOT COMPLETE)

    :param request: HTTP request object
    :param task_id: Task table key (task_id)
    :return: return completion message with HTTP status code (204)
    """
    task = Task.objects.get(task_id=task_id)
    task.delete()
    return Response({"message": "Task and related SubTasks deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['POST'])
def add_subtask(request, task_id):
    """

    :param request:
    :param task_id:
    :return:
    """
    data = request.data.copy()
    data['task_id'] = task_id
    serializer = SubTaskSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET'])
def display_subtasks(request, task_id):
    """
    return subtask as JSON

    :param request: HTTP request object
    :param task_id: subTask table key (task_id)
    :return: subtasks in JSON
    """
    subtasks = SubTask.objects.filter(task_id=task_id)
    serializer = SubTaskSerializer(subtasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_subtask(request, task_id, subtask_id):
    """
    return subTask as JSON

    :param request: HTTP request object
    :param task_id: subTask table key (task_id)
    :param subtask_id: subTask table key (subtask_id)
    :return: subTask in JSON
    """
    subtask = SubTask.objects.filter(task_id=task_id, subtask_id=subtask_id)
    serializer = TaskSerializer(subtask, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['PATCH'])
def update_subtask(request, task_id, subtask_id):
    """

    :param request:
    :param task_id:
    :param subtask_id:
    :return:
    """
    subtask = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    serializer = SubTaskSerializer(subtask, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['DELETE'])
def delete_subtask(request, task_id, subtask_id):
    """
    delete subtask

    :param request: HTTP request object
    :param task_id: Task table key (task_id)
    :param subtask_id: subtask table key (subtask_id)
    :return: return completion message with HTTP status code (204)
    """
    task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    task.delete()
    return Response({"message": "Task and related SubTasks deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET'])
def display_recently_added(request):
    tasks = Task.objects.filter().order_by('-created_at')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_in_progress(request):
    tasks = Task.objects.filter(status='DOING').order_by('-date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_reviews(request):
    tasks = Task.objects.filter(status='DONE').order_by('-date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)