from pathlib import Path
from openai import OpenAI

client = OpenAI()

output_dest = Path(__file__).parent.parent / "static" / "uploads"


def text_to_speech(
    text: str, voice: str = "alloy", model: str = "tts-1", folder_id: str = None
) -> Path:
    speech_file_path = (
        output_dest / str(folder_id) / "speech.wav"
        if folder_id
        else output_dest / "speech.wav"
    )
    response = client.audio.speech.create(
        model=model, voice=voice, input=text, response_format="wav"
    )
    response.stream_to_file(speech_file_path)
    return speech_file_path
