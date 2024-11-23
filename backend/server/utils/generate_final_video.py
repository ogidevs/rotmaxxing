from pathlib import Path
from moviepy import *
from moviepy.video.tools.subtitles import SubtitlesClip
from moviepy.video.fx.CrossFadeIn import CrossFadeIn
from moviepy.video.fx.CrossFadeOut import CrossFadeOut
from moviepy.video.fx.Resize import Resize
from moviepy.video.fx.Crop import Crop
from moviepy.audio.fx.AudioFadeIn import AudioFadeIn
from moviepy.audio.fx.AudioFadeOut import AudioFadeOut
from pysrt import open as open_srt
import random

import asyncio


output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"
fonts_dir = Path(__file__).resolve().parent.parent.parent / "static" / "fonts"


async def finalize_video(
    video_path, audio_path, subtitles_path, folder_id, subtitles_options, video_options
):
    try:
        # Validate font
        font_path = fonts_dir / subtitles_options["font"]
        if not font_path.exists():
            raise FileNotFoundError(f"Font not found: {font_path}")
        subtitles_options["font"] = str(font_path)

        # Prepare paths and output file
        output_file = output_dest / str(folder_id) / "result.mp4"
        video_path, audio_path, srt_file = map(
            Path, (video_path, audio_path, subtitles_path)
        )

        subtitles = await parse_srt(srt_file)
        video_duration = await get_duration_by_subtitles(subtitles)

        video = VideoFileClip(str(video_path))
        random_start = random.uniform(0, video.duration - video_duration)
        video = video.with_subclip(random_start, random_start + video_duration)

        video = video.with_effects(
            [
                CrossFadeIn(video_options.get("video_fadein", 3)),
                CrossFadeOut(video_options.get("video_fadeout", 3)),
            ]
        )
        audio = AudioFileClip(str(audio_path)).with_effects(
            [
                AudioFadeIn(video_options.get("audio_fadein", 3)),
                AudioFadeOut(video_options.get("audio_fadeout", 3)),
            ]
        )

        generator = lambda txt: TextClip(text=txt, **subtitles_options, size=video.size, margin=(10, 10))
        subtitle_clips = SubtitlesClip(subtitles=subtitles, make_textclip=generator)

        final_video = CompositeVideoClip(
            [
                video,
                subtitle_clips.with_position(
                    video_options.get("subtitles_position", "bottom")
                ),
            ]
        )
        final_video.audio = CompositeAudioClip([audio])

        final_video.write_videofile(
            str(output_file), fps=30, codec="libx264", preset="ultrafast"
        )

        return str(output_file)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


async def parse_srt(srt_file):
    subtitles = []
    srt = open_srt(srt_file)
    for sub in srt:
        start = sub.start.to_time()
        end = sub.end.to_time()
        text = sub.text.replace("\n", " ")
        start_seconds = (
            start.hour * 3600
            + start.minute * 60
            + start.second
            + start.microsecond / 1e6
        )
        end_seconds = (
            end.hour * 3600 + end.minute * 60 + end.second + end.microsecond / 1e6
        )
        subtitles.append(((start_seconds, end_seconds), text))
    return subtitles


async def get_duration_by_subtitles(subtitles):
    return subtitles[-1][0][1]


async def resize_video_for_tiktok(video):
    target_width, target_height = 1080, 1920
    aspect_ratio = target_width / target_height

    original_width, original_height = video.size
    original_aspect_ratio = original_width / original_height

    if original_aspect_ratio > aspect_ratio:
        new_width = int(original_height * aspect_ratio)
        crop_x = (original_width - new_width) // 2
        video = video.with_effects([Crop(x1=crop_x, x2=crop_x + new_width)])
    elif original_aspect_ratio < aspect_ratio:
        new_height = int(original_width / aspect_ratio)
        crop_y = (original_height - new_height) // 2
        video = video.with_effects([Crop(y1=crop_y, y2=crop_y + new_height)])

    # Resize to target dimensions
    return video.with_effects([Resize(height=target_height)])

async def main():
    await finalize_video(
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\background_videos\mc_video.mp4",
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\330ab0af-28fd-409a-896b-5d3fb2418f2b\speech.wav",
        r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\330ab0af-28fd-409a-896b-5d3fb2418f2b\subtitles.srt",
        "330ab0af-28fd-409a-896b-5d3fb2418f2b",
        {
            "font": "Montserrat-VariableFont.ttf",
            "font_size": 40,  # Larger font size for better visibility
            "color": "white",
            "stroke_color": "black",
            "stroke_width": 5,  # Enhance stroke for legibility
            "horizontal_align": "center",
            "vertical_align": "center",
            "text_align": "center",
            "bg_color": None,  # Transparent background
            "interline": 2,  # Adjust line spacing for readability
            "method": "caption",  # Automatically size to fit text
            "transparent": True,
            "duration": 5,  # Default duration (adjust per clip's length)
        },
        {
            "audio_fadein": 3,  # Fade in audio for smoother start
            "audio_fadeout": 3,  # Fade out audio for smoother end
            "video_fadein": 3,  # Fade in video for smoother start
            "video_fadeout": 3,  # Fade out video for smoother end
            "subtitles_position": "center",
        },
    )

if __name__ == "__main__":
    asyncio.run(main())
