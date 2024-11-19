from _datetime import datetime
from openai import OpenAI

template = """
|Start of document|
Document = {document}
|End of document|

|Start of task instructions|
- Only follow the output format defined.
- You are not allowed to output text between |Start of task instructions| and |End of output format instructions|
|End of task instruction|

|Start of output format instructions|
- Extract the following information from the document text: address or location, date, people, title
- location: location where you meet. if there is no location in input string, its null.
- date: time when you meet.
- people: people who you meet. if there is no people in input string, its null.
- title: summarize the input sentence
- Create a json like the form defined in |Start of json format instructions| and [End]
- The format is yyyymmdd0000 format by picking the date
- If multiple date information is included, or if there is only one date information, make it json array from root element

|End of output format instructions|

|Start of json format instructions|
[
  [
    "location": "파주 봉일천 중학교",
    "date": "202310041400",
    "people": "이민수",
    "title": "이민수와 봉일천 중학교에서 14시",
  ]
]

|End of json format instructions|
"""

def call_gpt_parser(input_string):
    client = OpenAI(
        api_key="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"
    )

    completion = client.chat.completions.create(
        # AI model
        model="gpt-4o",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": "지금은 " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + input_string},
        ]
    )
    return completion.choices[0].message.content.strip("```").strip("json")

print(call_gpt_parser("내일 오후 3시에 김태균을 만날거야."))
