from fastapi import APIRouter, HTTPException
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from server.utils.text_to_speech import text_to_speech
from server.utils.generate_subtitles import generate_subtitles
from server.schemas.upload import UploadResponseSchema, UploadSchema
import uuid

upload_router = APIRouter()


@upload_router.get("/static/{folder_id}/speech")
async def serve_static_file(folder: str):
    file_path = Path(f"server/static/uploads/{folder}/speech.wav")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.get("/static/{folder_id}/subtitles")
async def serve_static_file(folder: str):
    file_path = Path(f"server/static/uploads/{folder}/subtitles.srt")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.post("/generateBrainRot", response_model=UploadResponseSchema)
async def upload_file(upload: UploadSchema):
    generated_id = uuid.uuid4()
    folder_path = Path(f"server/static/uploads/{generated_id}")
    folder_path.mkdir(parents=True, exist_ok=True)
    speech_path = text_to_speech(text=upload.text, folder_id=generated_id)
    subtitles_path = generate_subtitles(
        folder_id=generated_id, file_path=str(speech_path)
    )
    print(speech_path, subtitles_path)

    return UploadResponseSchema(title=upload.title, video_result_file=str(speech_path))
