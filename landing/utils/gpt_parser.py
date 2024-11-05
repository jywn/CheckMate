from openai import OpenAI

def call_gpt_parser(input_string):
    client = OpenAI(
    )

    completion = client.chat.completions.create(
        # AI model
        model="gpt-4o",
        messages=[
            {"role": "system", "content": ""},
            {"role": "user", "content": input_string},
        ]
    )
    return completion.choices[0].message.content