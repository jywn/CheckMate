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

def call_gpt_parser(input_string):
    client = OpenAI(
        api_key="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"
    )

    completion = client.chat.completions.create(
        # AI model
        model="gpt-4o",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": ""},
        ]
    )
    print("result: ", completion.choices[0].message.content)
    return completion.choices[0].message.content