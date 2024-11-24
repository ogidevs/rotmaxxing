from pathlib import Path
import ffmpeg
import asyncio


output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"
fonts_dir = Path(__file__).resolve().parent.parent.parent / "static" / "fonts"


async def add_audio_to_video(video_path, audio_path, folder_id, video_duration):
    try:
        output_file = output_dest / str(folder_id) / f"temp_vid_with_audio.mp4"
        video_path, audio_path = map(str, (video_path, audio_path))
        video_input_stream = ffmpeg.input(str(video_path), t=video_duration)
        audio_input_stream = ffmpeg.input(str(audio_path))
        ffmpeg.output(video_input_stream.video, audio_input_stream.audio, str(output_file), vcodec='copy', acodec='aac').run(overwrite_output=True)
        return str(output_file)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

async def finalize_video(
    video_path, subtitles_path, folder_id, video_options
):
    try:
        video_options = dict(video_options)
    
        output_file = output_dest / str(folder_id) / "result.mp4"

        
        fadein_duration = video_options.get("video_fadein", 3)
        fadeout_duration = video_options.get("video_fadeout", 3)
        
        audio_fadein = video_options.get("audio_fadein", 3)
        audio_fadeout = video_options.get("audio_fadeout", 3)
        
        video_input_stream = ffmpeg.input(str(video_path))
        video_duration = await get_video_duration(video_path)

        # Add subtitles filter
        video_input_stream = video_input_stream.filter('subtitles', filename=str(subtitles_path).replace("\\", "/"))
        
        # Apply fade in/out to video
        video_input_stream = video_input_stream.filter('fade', type='in', start_time=0, duration=fadein_duration)
        video_input_stream = video_input_stream.filter('fade', type='out', start_time=max(0, video_duration - fadeout_duration), duration=fadeout_duration)

        # Handle audio - apply fade-in/fade-out
        audio_input_stream = ffmpeg.input(str(video_path))
        
        # Apply audio fade-in/out if specified
        if audio_fadein > 0:
            audio_input_stream = audio_input_stream.filter('afade', type='in', start_time=0, duration=audio_fadein)
        if audio_fadeout > 0:
            audio_input_stream = audio_input_stream.filter('afade', type='out', start_time=max(0, video_duration - audio_fadeout), duration=audio_fadeout)

        # Combine video and audio streams
        video_input_stream = ffmpeg.output(video_input_stream, audio_input_stream, str(output_file), vcodec='libx264', acodec='aac', preset="ultrafast", audio_bitrate='192k')
        ffmpeg.run(video_input_stream, overwrite_output=True)
        
        return str(output_file)

    except Exception as e:
        print(f"Error processing video: {e}")
        return None

async def get_video_duration(video_path):
    probe = ffmpeg.probe(str(video_path), v='error', select_streams='v:0', show_entries='format=duration')
    return float(probe['format']['duration'])

async def main():
    await finalize_video(
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\0e126e2c-69ec-493c-8aea-5f1640342392\temp_vid_with_audio.mp4",
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\0e126e2c-69ec-493c-8aea-5f1640342392\subtitles.ass",
        "0e126e2c-69ec-493c-8aea-5f1640342392",
        {
            "audio_fadein": 3,  # Fade in audio for smoother start
            "audio_fadeout": 3,  # Fade out audio for smoother end
            "video_fadein": 3,  # Fade in video for smoother start
            "video_fadeout": 3,  # Fade out video for smoother end
            "video_duration": 20
        },
    )
    # await add_audio_to_video(
    #     r'C:\Users\ogi\Desktop\rotmaxxing\backend\static\background_videos\mc_video.mp4',
    #     r'C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\0e126e2c-69ec-493c-8aea-5f1640342392\speech.wav',
    #     '0e126e2c-69ec-493c-8aea-5f1640342392',
    #     19
    # )

if __name__ == "__main__":
    asyncio.run(main())

