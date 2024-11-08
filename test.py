from _datetime import datetime

from django.utils.timezone import now
from openai import OpenAI

template = """
입력 문장에서 다음과 같은 규칙을 따라서 JSON을 만들어줘.
세 field는 time, people, place로 규칙은 다음과 같아.

1. time은 YYYYMMDDhhmm 형식으로 반환되어야 해.
4일 후를 입력 받으면, 지금으로부터 4일 후를 저장해.
예를 들어, 1월 1일에 3일 후를 입력받으면, 1월 4일을 저장해.
어떠한 날짜나 시간도 존재하지 않는다면 null을 저장해.

2. people은 문자열 형식으로 사람이나 집단의 이름을 저장해.
어떠한 사람이나 집단도 존재하지 않는다면 null을 저장해.  

3. place는 문자열 형식으로 약속 장소를 저장해.
어떠한 장소도 존재하지 않는다면 null을 저장해.
"""

def call_gpt_parser(input_string):
    client = OpenAI(
        api_key=""
    )

    completion = client.chat.completions.create(
        # AI model
        model="gpt-4o",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": "지금은 " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + input_string},
        ]
    )
    print("result: ", completion.choices[0].message.content)
    return completion.choices[0].message.content
