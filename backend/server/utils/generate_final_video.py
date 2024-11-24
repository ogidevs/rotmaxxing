from pathlib import Path
from pysrt import open as open_srt
import random
import ffmpeg
import asyncio


output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"
fonts_dir = Path(__file__).resolve().parent.parent.parent / "static" / "fonts"

SUBTITLE_POSITIONS = {
    "bottom-left": 1,
    "bottom-center": 2,
    "bottom-right": 3,
    "middle-left": 8,
    "center": 10,
    "middle-right": 11,
    "top-left": 4,
    "top-center": 6,
    "top-right": 7,
}

async def finalize_video(
    video_path, audio_path, subtitles_path, folder_id, subtitles_options, video_options
):
    try:
        # Validate font
        subtitles_options = dict(subtitles_options)
        video_options = dict(video_options)
        
        font_path = fonts_dir / subtitles_options["font"]
        if not font_path.exists():
            raise FileNotFoundError(f"Font not found: {font_path}")
        font_path = str(font_path)

        # Prepare paths and output file
        output_file = output_dest / str(folder_id) / "result.mp4"
        video_path, audio_path, srt_file = map(str, (video_path, audio_path, subtitles_path))

        video_duration = await get_last_time_from_srt(srt_file)

        # Random start for video
        video_start = random.uniform(0, await get_video_duration(video_path) - video_duration)
        
        fadein_duration = video_options.get("video_fadein", 3)
        fadeout_duration = video_options.get("video_fadeout", 3)
        
        audio_fadein = video_options.get("audio_fadein", 3)
        audio_fadeout = video_options.get("audio_fadeout", 3)
        
        
        subtitles_options["Alignment"] = SUBTITLE_POSITIONS[subtitles_options["Alignment"]]
        
        subtitle_style = f"FontName={font_path},FontSize={subtitles_options['FontSize']},PrimaryColour={subtitles_options['PrimaryColour']},SecondaryColour={subtitles_options['SecondaryColour']},OutlineColour={subtitles_options['OutlineColour']},Outline={subtitles_options['Outline']},Shadow={subtitles_options['Shadow']},Alignment={subtitles_options['Alignment']}"
        
        video_input_stream = ffmpeg.input(str(video_path), ss=video_start, t=video_duration)
        video_input_stream = video_input_stream.filter('subtitles', filename=str(subtitles_path).replace("\\", "/"), force_style=subtitle_style)
        video_input_stream = video_input_stream.filter('fade', type='in', start_time=0, duration=fadein_duration)
        video_input_stream = video_input_stream.filter('fade', type='out', start_time=max(0, video_duration - audio_fadeout), duration=fadeout_duration)
        audio_input_stream = ffmpeg.input(str(audio_path))
        audio_input_stream = audio_input_stream.filter('afade', type='in', start_time=0, duration=audio_fadein)
        audio_input_stream = audio_input_stream.filter('afade', type='out', start_time=max(0, video_duration - audio_fadeout), duration=audio_fadeout)
        ffmpeg.output(video_input_stream, audio_input_stream, str(output_file), preset="ultrafast").run(overwrite_output=True)
        return str(output_file)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
async def get_last_time_from_srt(srt_file):
    srt = open_srt(srt_file)
    last_time = srt[-1].end.to_time()
    return last_time.hour * 3600 + last_time.minute * 60 + last_time.second + last_time.microsecond / 1e6

async def get_video_duration(video_path):
    probe = ffmpeg.probe(str(video_path), v='error', select_streams='v:0', show_entries='format=duration')
    return float(probe['format']['duration'])

async def main():
    await finalize_video(
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\background_videos\mc_video.mp4",
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\6e1c3f9d-9ebc-457c-8902-4ba060fa6303\speech.wav",
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\6e1c3f9d-9ebc-457c-8902-4ba060fa6303\subtitles.srt",
        "6e1c3f9d-9ebc-457c-8902-4ba060fa6303",
        {
            "font": "Montserrat-VariableFont.ttf",
            "FontSize": 24,  # Font size in pixels
            "PrimaryColour": "&HFFFFFF&",  # Text color (white)
            "SecondaryColour": "&HFF0000&",  # Secondary color (red)
            "Outline": 2,  # Outline width (2px)
            "OutlineColour": "&H000000&",  # Outline color (black)
            "Shadow": 1,  # Shadow effect (enabled)
            "ShadowColour": "&H000000&",  # Shadow color (black)
            "Bold": 1,  # Bold text (enabled)
            "Italic": 1,  # Italic text (enabled)
            "MarginV": 10,  # Vertical margin (distance from bottom)
            "Underline": 1,  # Underline text (enabled)
            "StrikeOut": 0,  # Strikeout text (disabled)
            "Alignment": 'center'  # Subtitle alignment (bottom-center)
            },
        {
            "audio_fadein": 3,  # Fade in audio for smoother start
            "audio_fadeout": 3,  # Fade out audio for smoother end
            "video_fadein": 3,  # Fade in video for smoother start
            "video_fadeout": 3,  # Fade out video for smoother end
        },
    )

if __name__ == "__main__":
    asyncio.run(main())

