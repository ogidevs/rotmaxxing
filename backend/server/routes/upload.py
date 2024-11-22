from fastapi import APIRouter, HTTPException
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from server.utils.text_to_speech import text_to_speech
from server.utils.generate_subtitles import generate_subtitles
from server.schemas.upload import UploadResponseSchema, UploadSchema
import uuid, requests, os

upload_router = APIRouter()
VIDEO_PROCESSOR_PORT = os.getenv("ACTIX_PORT", 6969)


@upload_router.get("/static/{folder_id}/speech")
async def serve_speech(folder_id: str):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/speech.wav")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.get("/static/{folder_id}/subtitles")
async def serve_subtitles(folder_id: str):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/subtitles.srt")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.post("/generateBrainRot", response_model=UploadResponseSchema)
async def upload_file(upload: UploadSchema):
    generated_id = uuid.uuid4()
    folder_path = Path(os.getcwd() + f"/static/uploads/{generated_id}")
    folder_path.mkdir(parents=True, exist_ok=True)
    speech_path = text_to_speech(text=upload.text, folder_id=generated_id)
    subtitles_path = generate_subtitles(
        folder_id=generated_id, file_path=str(speech_path)
    )

    response = requests.post(
        f"http://localhost:{VIDEO_PROCESSOR_PORT}/{generated_id}",
    )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to generate video")

    return UploadResponseSchema(
        title=upload.title, video_result_file=f"{folder_path}/result.mp4"
    )
