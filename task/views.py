from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework.views import APIView

from core.models import Task, NotePad
from core.models import SubTask
from core.serializers import TaskSerializer, SubTaskSerializer, NotePadSerializer
from core.utils.gpt_parser import call_gpt_parser


"""
FIX DATE FORMAT
importance -> patch
reminder -> patch
done -> post
attach file -> MySQL, POST 
title -> patch
description -> patch
date -> patch
add task without parsing -> post
communicate with json
Notes = notepad, memojang
done -> status change
how reminder works?
"""

# filter vs get_list_or_404
# 자동 예외 처리가 필요한 경우 -> get_*_or_404
# 빈 쿼리일 가능성이 높은 경우 -> filter
# 빈 쿼리여도 error가 아닌 경우 -> filter
class TaskListCreateAPIView(APIView):
    """
    Display List of Tasks and Create Task
    """
    def get(self, request):
        """
        Display Tasks
        :param request:
        :return: List of Tasks in JSON
        """
        tasks = Task.objects.filter()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Create a Task via using GPT parser
        :param request: 'input_string'
        :return: parsed data in JSON
        """
        dict_data = json.loads(request.data)
        if dict_data['gpt'] == 'yes':
            gpt_response_json = call_gpt_parser(dict_data['input_string'])
            gpt_response_dict = json.loads(gpt_response_json)
            serializer = TaskSerializer(data=gpt_response_dict, many=True)

        else:
            serializer = TaskSerializer(data=dict_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailAPIView(APIView):
    """
    Display a Task, Update a Task, Delete a Task
    """
    def get(self, request, task_id):
        """
        Display a Task
        :param request:
        :param task_id:
        :return: A Task in JSON
        """
        task = get_object_or_404(Task, task_id=task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, task_id):
        """
        Update a Task
        :param request:
        :param task_id:
        :return: A Task in JSON
        """
        task = get_object_or_404(Task, task_id=task_id)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id):
        """
        Delete a Task
        :param request:
        :param task_id:
        :return: Status message and HTTP code
        """
        task = Task.objects.get(task_id=task_id)
        task.delete()
        return Response({"message": "Task and related SubTasks deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class SubTaskListCreateAPIView(APIView):
    """
    Display List of SubTasks and Create SubTask
    """
    def get(self, request, task_id):
        """
        Display SubTask
        :param request:
        :param task_id:
        :return: List of SubTasks in JSON
        """
        subtasks = SubTask.objects.filter(task_id=task_id)
        serializer = SubTaskSerializer(subtasks, many=True)
        return Response(serializer.data)

    def post(self, request, task_id):
        """
        Create a SubTask
        :param request: SubTask model information
        :param task_id:
        :return: data in JSON
        """
        data = request.data.copy()
        data['task_id'] = task_id
        serializer = SubTaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubTaskDetailAPIView(APIView):
    """
    Display a SubTask, Update a SubTask, Delete a SubTask
    """
    def get(self, request, task_id, subtask_id):
        """
        Display a SubTask
        :param request:
        :param task_id:
        :param subtask_id:
        :return: A SubTask in JSON
        """
        subtask = SubTask.objects.filter(task_id=task_id, subtask_id=subtask_id)
        serializer = SubTaskSerializer(subtask, many=True)
        return Response(serializer.data)

    def patch(self, request, task_id, subtask_id):
        """
        Update a SubTask
        :param request:
        :param task_id:
        :param subtask_id:
        :return: A SubTask in JSON
        """
        subtask = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
        serializer = SubTaskSerializer(subtask, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(selfs, request, task_id, subtask_id):
        """
        Delete a SubTask
        :param request:
        :param task_id:
        :param subtask_id:
        :return: Status message and HTTP code
        """
        task = SubTask.objects.get(task_id=task_id, subtask_id=subtask_id)
        task.delete()
        return Response({"message": "Task and related SubTasks deleted successfully."},
                        status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET'])
def display_recently_added(request):
    """
    Display recently added Tasks
    :param request:
    :return: List of Tasks ordered by created-date in JSON
    """
    tasks = Task.objects.filter().order_by('-created_at')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_in_progress(request):
    """
    Display Tasks in progress
    :param request:
    :return: List of Tasks ordered by date in JSON
    """
    tasks = Task.objects.filter(status='DOING').order_by('-date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def display_reviews(request):
    """
    Display Tasks in review
    :param request:
    :return: List of Tasks ordered by date in JSON
    """
    tasks = Task.objects.filter(status='DONE').order_by('-date')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

