from _datetime import datetime
from openai import OpenAI

template = """
|Start of document|
Document = {document}
|End of document|

|Start of task instructions|
- Only follow the output format defined between |Start of output format instructions| and |End of output format instructions|.
- You are not allowed to output text between |Start of task instructions| and |End of output format instructions|.
- You must follow the json format defined between |Start of json format instructions| and |End of json format instructions|.
- do not use '[' or ']' in answer.
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
{
    "location": "파주 봉일천 중학교",
    "date": "202310041400",
    "people": "이민수",
    "title": "이민수와 봉일천 중학교에서 14시"
}

|End of json format instructions|
"""

def call_gpt_parser(input_string):
    client = OpenAI(
        api_key = "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"
    )
    template_string = "지금은 " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + input_string
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": template_string},
        ]
    )

    return completion.choices[0].message.content

