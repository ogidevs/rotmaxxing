from tempfile import NamedTemporaryFile
from fastapi import APIRouter, Depends, HTTPException
from starlette.requests import Request
from pathlib import Path
from fastapi.responses import FileResponse
import uuid, os
import zipfile

from server.auth.auth_bearer import JWTBearer
from server.auth.auth_handler import decode_jwt
from server.database import deduct_user_credit, get_user
from server.utils.text_to_speech import text_to_speech
from server.utils.generate_subtitles import generate_subtitles, update_subtitles_style
from server.utils.video_proccessing import add_audio_to_video, process_video_output
from server.schemas.upload import GenerateBrainrotSchema, GenerateDownloadSchema
from server.rate_limiter import limiter
import asyncio

upload_router = APIRouter()

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

@upload_router.post("/generateBrainrot", dependencies=[Depends(JWTBearer())])
@limiter.limit("33/minute")
async def upload_file(upload: GenerateBrainrotSchema, request : Request, token: dict = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    user = dict(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["credit"] < 5:
        raise HTTPException(status_code=400, detail="Insufficient credits to process video")
    await deduct_user_credit(user["id"], 5)
    
    if upload.folder_id is not None:
        print("ALREADY EXISTS VIDEO WITH AUDIO AND SUBTITLES")
        folder_path = Path(os.getcwd() + f"/static/uploads/{upload.folder_id}")
        video_path = folder_path / "temp_vid_with_audio.mp4"
        subtitles_path = folder_path / "subtitles.ass"
        if not folder_path.exists() or not video_path.exists() or not subtitles_path.exists():
            raise HTTPException(status_code=400, detail="Folder not found")
        
        subtitles_path = await update_subtitles_style(
            folder_id=upload.folder_id,
            style=upload.subtitle_options,
        )
        
        file_paths = [video_path, subtitles_path]
        
        with NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
            with zipfile.ZipFile(tmp.name, "w") as zipf:
                for file_path in file_paths:
                    file_name = Path(file_path).name
                    zipf.write(file_path, arcname=file_name)

            zip_file_path = tmp.name

        return FileResponse(zip_file_path, media_type="application/zip", filename=f"{upload.folder_id}.zip")
        
    generated_id = uuid.uuid4()
    background_videos_path = Path(os.getcwd() + "/static/background_videos")
    random_background_video = background_videos_path / "mc_video.mp4"
    folder_path = Path(os.getcwd() + f"/static/uploads/{generated_id}")
    folder_path.mkdir(parents=True, exist_ok=True)
    speech_path, duration = await text_to_speech(
        text=upload.text, folder_id=generated_id, voice=upload.audio_options.voice
    )
    add_audio_task = asyncio.create_task(add_audio_to_video(
        video_path=random_background_video,
        audio_path=str(speech_path),
        folder_id=generated_id,
        video_duration=duration,
    ))
    generate_subtitles_task = asyncio.create_task(generate_subtitles(
        folder_id=generated_id,
        file_path=str(folder_path / "speech.wav"),
        style=upload.subtitle_options,
    ))

    video_path = await add_audio_task
    subtitles_path = await generate_subtitles_task
    file_paths = [video_path, subtitles_path]
    
    with NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
        with zipfile.ZipFile(tmp.name, "w") as zipf:
            for file_path in file_paths:
                file_name = Path(file_path).name
                zipf.write(file_path, arcname=file_name)

        zip_file_path = tmp.name

    return FileResponse(zip_file_path, media_type="application/zip", filename=f"{str(generated_id)}.zip")

@upload_router.post("/generateDownload", dependencies=[Depends(JWTBearer())])
@limiter.limit("10/minute")
async def generate_download(upload: GenerateDownloadSchema, request : Request, token: dict = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    user = dict(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["credit"] < 5:
        raise HTTPException(status_code=400, detail="Insufficient credits to process video")
    await deduct_user_credit(user["id"], 5)
    
    folder_path = Path(os.getcwd() + f"/static/uploads/{upload.folder_id}")
    if not folder_path.exists():
        raise HTTPException(status_code=400, detail="Folder not found")
    
    result = await process_video_output(
        video_path=str(folder_path / "temp_vid_with_audio.mp4"),
        subtitles_path=str(folder_path / "subtitles.ass"),
        folder_id=upload.folder_id,
        video_options=upload.video_options,
    )
    
    return FileResponse(result, media_type="video/mp4")
