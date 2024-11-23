import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.serializers import TaskSerializer
from .utils.gpt_parser import call_gpt_parser

@csrf_exempt
@api_view(['POST'])
def create_task(request):
    """
    input string is parsed by GPT, and saved as Task

    :param request: HTTP request object
    :return: parsed Task with HTTP status code (201/400)
    """
    data1 = call_gpt_parser(request.data['input_string'])
    parsed_data = json.loads(data1)
    print(data1)
    print(parsed_data)

    serializer = TaskSerializer(data=parsed_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)