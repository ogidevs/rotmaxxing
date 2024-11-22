from fastapi import APIRouter, HTTPException
from pathlib import Path
from fastapi.responses import FileResponse
from server.utils.text_to_speech import text_to_speech
from server.utils.generate_subtitles import generate_subtitles
from server.utils.squash_video import finalize_video
from server.schemas.upload import UploadSchema
import uuid, os

upload_router = APIRouter()
VIDEO_PROCESSOR_PORT = os.getenv("ACTIX_PORT", 6969)


@upload_router.get("/static/{folder_id}/speech", include_in_schema=False)
async def serve_speech(folder_id: str):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/speech.wav")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.get("/static/{folder_id}/subtitles", include_in_schema=False)
async def serve_subtitles(folder_id: str):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/subtitles.srt")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.post("/generateBrainRot")
async def upload_file(upload: UploadSchema):
    generated_id = uuid.uuid4()
    background_videos_path = Path(os.getcwd() + "/static/background_videos")
    random_background_video = background_videos_path / "mc_video.mp4"
    folder_path = Path(os.getcwd() + f"/static/uploads/{generated_id}")
    folder_path.mkdir(parents=True, exist_ok=True)
    speech_path = text_to_speech(text=upload.text, folder_id=generated_id)
    subtitles_path = generate_subtitles(
        folder_id=generated_id, file_path=str(speech_path)
    )
    result = finalize_video(
        video_path=random_background_video,
        audio_path=str(speech_path),
        subtitles_path=str(subtitles_path),
        folder_id=generated_id,
        options=upload.subtitle_options,
    )

    return FileResponse(result, media_type="video/mp4")
