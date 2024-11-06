import openai

# OpenAI API 키 설정
openai.api_key = ""

def STT_whisper(input_voice):
    # 오디오 파일 열기
    audio_file_path = "path_to_your_audio_file.mp3"  # 지원 형식: mp3, wav, m4a 등
    with open(audio_file_path, "rb") as audio_file:
        # Whisper 모델 호출
        transcription = openai.Audio.transcribe("whisper-1", audio_file)

    # 결과 출력
    print("Transcription:", transcription['text'])
    return transcription['text']