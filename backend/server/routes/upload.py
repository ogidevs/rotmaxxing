from fastapi import APIRouter, Depends, HTTPException, Request
from pathlib import Path
from fastapi.responses import FileResponse
import uuid, os

from server.auth.auth_bearer import JWTBearer
from server.auth.auth_handler import decode_jwt
from server.database import deduct_user_credit, get_user
from server.utils.text_to_speech import text_to_speech
from server.utils.generate_subtitles import generate_subtitles
from server.utils.generate_final_video import finalize_video
from server.schemas.upload import UploadSchema
from server.rate_limiter import limiter

upload_router = APIRouter()
VIDEO_PROCESSOR_PORT = os.getenv("ACTIX_PORT", 6969)


@upload_router.get("/static/{folder_id}/speech", include_in_schema=False, dependencies=[Depends(JWTBearer())])
@limiter.limit("5/minute")
async def serve_speech(folder_id: str, request : Request):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/speech.wav")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


@upload_router.get("/static/{folder_id}/subtitles", include_in_schema=False, dependencies=[Depends(JWTBearer())])
@limiter.limit("5/minute")
async def serve_subtitles(folder_id: str, request : Request):
    file_path = Path(os.getcwd() + f"/static/uploads/{folder_id}/subtitles.srt")

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)

@upload_router.post("/generateBrainRot", dependencies=[Depends(JWTBearer())])
@limiter.limit("10/minute")
async def upload_file(upload: UploadSchema, request : Request, token: dict = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    user = dict(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["credit"] < 5:
        raise HTTPException(status_code=400, detail="Insufficient credits to process video")
    await deduct_user_credit(user["id"], 5)
    
    generated_id = uuid.uuid4()
    background_videos_path = Path(os.getcwd() + "/static/background_videos")
    random_background_video = background_videos_path / "mc_video.mp4"
    folder_path = Path(os.getcwd() + f"/static/uploads/{generated_id}")
    folder_path.mkdir(parents=True, exist_ok=True)
    speech_path = await text_to_speech(
        text=upload.text, folder_id=generated_id, voice=upload.audio_options.voice
    )
    subtitles_path = await generate_subtitles(
        folder_id=generated_id,
        file_path=str(speech_path),
    )
    result = await finalize_video(
        video_path=random_background_video,
        audio_path=str(speech_path),
        subtitles_path=str(subtitles_path),
        folder_id=generated_id,
        subtitles_options=upload.subtitle_options,
        video_options=upload.video_options,
    )

    return FileResponse(result, media_type="video/mp4")
