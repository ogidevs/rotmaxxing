from pathlib import Path
from fastapi import HTTPException
from openai import OpenAI

client = OpenAI()

output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"


voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]


async def text_to_speech(text: str, voice: str = "alloy", folder_id: str = None) -> Path:
    try:
        if voice not in voices:
            raise ValueError(f"Voice {voice} not found. Available voices: {voices}")
        speech_file_path = (
            output_dest / str(folder_id) / "speech.wav"
            if folder_id
            else output_dest / "speech.wav"
        )
        response = client.audio.speech.create(
            model="tts-1", voice=voice, input=text, response_format="wav"
        )
        response.stream_to_file(speech_file_path)
        return speech_file_path
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
