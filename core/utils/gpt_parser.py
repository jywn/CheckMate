from _datetime import datetime
from openai import OpenAI

template = """
|Start of document|
Document = {document}
|End of document|

|Start of task instructions|
- Extract specific information from the document based on the output format instructions.
- Only follow the output format defined.
- Do not include any output between |Start of task instructions| and |End of output format instructions
- If any field cannot be identified, explicitly set it to `null`.
|End of task instruction|

|Start of output format instructions|
- Extract the following fields from the document text:
  - **location**: Location where the meeting occurs. If no location is mentioned, set to `null`.
  - **date**: Date and time in `YYYY-MM-DDThh:mm` format. If no specific time is given, default to `0000`. If multiple dates are mentioned, extract all as an array.
  - **people**: Names of people mentioned in the document. If no people are mentioned, set to `null`.
  - **title**: Summarize the document briefly, combining key information (location, date, and people).
- The output must be a valid JSON array.

|End of output format instructions|

|Start of json format instructions|
{
  "location": "파주 봉일천 중학교",
  "date": "2023-10-04-T14:00",
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
        model="gpt-4",
        messages=[
            {"role": "system", "content": template},
            {"role": "user", "content": template_string},
        ]
    )

    return completion.choices[0].message.content

