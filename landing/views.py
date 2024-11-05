import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils.gpt_parser import call_gpt_parser
# Create your views here.
@csrf_exempt
def input_parser(request):
    if request.method == 'POST':
        # load json request.body into python dict
        data = json.loads(request.body)
        # extract input_string
        input_string = data['input_string']
        # GPT parse data into JSON
        parsed_result = call_gpt_parser(input_string)