import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from core.models import Task
from .utils.STT_whisper import STT_whisper
from .utils.gpt_parser import call_gpt_parser
# Create your views here.
@csrf_exempt
def input_parser(request):
    if request.method == 'POST':
        # load json request.body into python dict
        data = json.loads(request.body)
        # extract input_string
        input_string = data['input_string']
        # GPT parse data into JSON and into dict
        dict_result = json.loads(call_gpt_parser(input_string))
        # upload on model (...)
        Task.objects.create(time=dict_result["time"], reminder=dict_result["reminder"]) # ...
        # response with result to show user the result
        return None
@csrf_exempt
def input_string(request):
    return None

@csrf_exempt
def voice_recognition(request, input_voice=None):
    if request.method == 'POST':
        STT_whisper(input_voice)
