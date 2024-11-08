from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import Task
from core.models import SubTask
from task.serializers import TaskSerializer, SubTaskSerializer

# filter vs get_list_or_404
# 자동 예외 처리가 필요한 경우 -> get_*_or_404
# 빈 쿼리일 가능성이 높은 경우 -> filter
# 빈 쿼리여도 error가 아닌 경우 -> filter

@api_view(['GET'])
def display_tasks(request, user_id):
    """
    return Tasks as JSON

    :param request: HTTP request object
    :param user_id: Task table key (user_id)
    :return: Tasks in JSON
    """
    fields = request.query_params.getlist('fields')
    tasks = Task.objects.filter(user_id=user_id)
    serializer = TaskSerializer(tasks, fields=fields, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def display_subtasks(request, user_id, task_id):
    """
    return SubTasks as JSON

    :param request: HTTP request object
    :param user_id: SubTask table key (user_id)
    :param task_id: SubTask table key (task_id)
    :return: SubTasks in JSON
    """
    fields = request.query_params.getlist('fields')
    sub_tasks = SubTask.objects.filter(user_id=user_id, task_id=task_id)
    serializer = SubTaskSerializer(sub_tasks, fields=fields, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def complete_subtask(request, user_id, task_id, subtask_id):
    """
    update SubTask status (WILL -> DONE)

    :param request: HTTP request object
    :param user_id: SubTask table key (user_id)
    :param task_id: SubTask table key (task_id)
    :param subtask_id: SubTask table key (subtask_id)
    :return: SubTask in JSON with HTTP status code (200/400)
    """
    sub_task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
    serializer = SubTaskSerializer(sub_task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_task(request, user_id, task_id):
    """
    delete Task (NOT COMPLETE)

    :param request: HTTP request object
    :param user_id: Task table key (user_id)
    :param task_id: Task table key (task_id)
    :return: return completion message with HTTP status code (204)
    """
    task = Task.objects.get(user_id=user_id, task_id=task_id)
    task.delete()
    return Response({"message": "Task and related SubTasks deleted successfully."}, status=status.HTTP_204_NO_CONTENT)