from _datetime import datetime
from openai import OpenAI

template = """
|Start of document|
Document = {document}
|End of document|

|Start of task instructions|
- Only follow the output format defined.
- You are not allowed to output text between |Start of task instructions| and |End of output format instructions
|End of task instruction|

|Start of output format instructions|
- Extract the following information from the document text: address or location, date
- Create a json like the form defined in |Start of json format instructions| and [End]
- The start format is yyyymmddT0000Z format by picking the start date
The end format is the same as the start date, but just make the time 230000Z. If the start is 20231004T000000Z, you can make the end 20231004T230000Z
- If multiple date information is included, or if there is only one date information, make it json array from root element

|End of output format instructions|

|Start of json format instructions|
[
  [
    "location": "파주 봉일천 중학교",
    "start": "20231004T000000Z",
    "end": "20231004T230000Z"
  ],
  [
    "location": "파주 봉일천 중학교",
    "start": "20231129T000000Z",
    "end": "20231129T230000Z"
  ]
]

|End of json format instructions|
"""

tmp = """
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

4. python에서 사용할 것이니 홑따옴표 \'\'\' 대신 쌍따옴표 \"\"\"를 사용해서 둘러싸.
"""

def call_gpt_parser(input_string):
    client = OpenAI(
        api_key="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"
    )

    completion = client.chat.completions.create(
        # AI model
        model="gpt-4o",
        messages=[
            {"role": "system", "content": tmp},
            {"role": "user", "content": "지금은 " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + input_string},
        ]
    )
    return completion.choices[0].message.content.strip("```").strip("json")