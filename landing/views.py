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
    parsed_data = json.loads(call_gpt_parser(request.data['input_string']))

    # user_id를 고정값으로 추가
    parsed_data['user_id'] = 1

    serializer = TaskSerializer(data=parsed_data)
    if serializer.is_valid():
        serializer.save()  # user_id가 1로 설정된 데이터가 저장됨
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)