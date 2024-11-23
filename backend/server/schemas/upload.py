from pydantic import BaseModel, Field, model_validator
from typing import Optional, Dict, Any


class UploadSchema(BaseModel):
    title: str = Field(
        ..., description="The title of the upload.", min_length=1, max_length=255
    )
    text: str = Field(
        ...,
        description="The text to be converted to speech and displayed as subtitles.",
        min_length=1,
        max_length=4000,
    )
    subtitle_options: Optional[Dict[str, Any]] = Field(
        None,
        description="subtitle_options for the upload.",
        example={
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
    )
    video_options: Optional[Dict[str, Any]] = Field(
        None,
        description="video_options for the upload.",
        example={
            "audio_fadein": 3,  # Fade in audio for smoother start
            "audio_fadeout": 3,  # Fade out audio for smoother end
            "video_fadein": 3,  # Fade in video for smoother start
            "video_fadeout": 3,  # Fade out video for smoother end
            "subtitles_position": "center",
        },
    )
    audio_options: Optional[Dict[str, Any]] = Field(
        None,
        description="audio_options for the upload.",
        example={
            "voice": "alloy",
        },
    )

    @model_validator(mode="before")
    def set_default_subtitle_options(cls, values):
        default_subtitle_options = {
            "font": "Montserrat-VariableFont.ttf",
            "font_size": 20,
            "color": "white",
            "stroke_color": "black",
            "stroke_width": 2,
            "bg_color": None,
            "text_align": "center",
            "horizontal_align": "center",
            "vertical_align": "center",
            "interline": 6,
            "method": "label",
            "transparent": True,
        }
        subtitle_options = values.get("subtitle_options", {})
        if subtitle_options is None:
            subtitle_options = {}
        # Merge default subtitle_options with provided values
        values["subtitle_options"] = {**default_subtitle_options, **subtitle_options}
        return values

    @model_validator(mode="before")
    def set_default_video_options(cls, values):
        default_video_options = {
            "audio_fadein": 3,
            "audio_fadeout": 3,
            "video_fadein": 3,
            "video_fadeout": 3,
            "subtitles_position": "top",
        }
        video_options = values.get("video_options", {})
        if video_options is None:
            video_options = {}
        # Merge default video_options with provided values
        values["video_options"] = {**default_video_options, **video_options}
        return values

    @model_validator(mode="before")
    def set_default_audio_options(cls, values):
        default_audio_options = {
            "voice": "alloy",
        }
        audio_options = values.get("audio_options", {})
        if audio_options is None:
            audio_options = {}
        # Merge default audio_options with provided values
        values["audio_options"] = {**default_audio_options, **audio_options}
        return values

    class Config:
        str_strip_whitespace = True
