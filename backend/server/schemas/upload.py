from pydantic import BaseModel, Field, model_validator
from typing import Optional, Dict, Any

class SubtitleOptions(BaseModel):
    font: str = Field(
        "Montserrat-VariableFont.ttf",
        description="The font file to be used for the subtitles.",
        example="Montserrat-VariableFont.ttf",
    )
    FontSize: int = Field(
        24,
        description="The font size in pixels.",
        example=24,
    )
    PrimaryColour: str = Field(
        "&HFFFFFF&",
        description="The text color in hexadecimal.",
        example="&HFFFFFF&",
    )
    SecondaryColour: str = Field(
        "&HFF0000&",
        description="The secondary color in hexadecimal.",
        example="&HFF0000&",
    )
    Outline: int = Field(
        2,
        description="The outline width in pixels.",
        example=2,
    )
    OutlineColour: str = Field(
        "&H000000&",
        description="The outline color in hexadecimal.",
        example="&H000000&",
    )
    Shadow: int = Field(
        1,
        description="The shadow effect (0 or 1).",
        example=1,
    )
    ShadowColour: str = Field(
        "&H000000&",
        description="The shadow color in hexadecimal.",
        example="&H000000&",
    )
    Bold: int = Field(
        1,
        description="The bold text (0 or 1).",
        example=1,
    )
    Italic: int = Field(
        1,
        description="The italic text (0 or 1).",
        example=1,
    )
    MarginV: int = Field(
        10,
        description="The vertical margin (distance from bottom).",
        example=10,
    )
    Underline: int = Field(
        1,
        description="The underline text (0 or 1).",
        example=1,
    )
    StrikeOut: int = Field(
        0,
        description="The strikeout text (0 or 1).",
        example=0,
    )
    Alignment: str = Field(
        "center",
        description="The subtitle alignment (bottom-center).",
        example="center",
    )

class VideoOptions(BaseModel):
    audio_fadein: int = Field(
        3,
        description="Fade in audio for smoother start.",
        example=3,
    )
    audio_fadeout: int = Field(
        3,
        description="Fade out audio for smoother end.",
        example=3,
    )
    video_fadein: int = Field(
        3,
        description="Fade in video for smoother start.",
        example=3,
    )
    video_fadeout: int = Field(
        3,
        description="Fade out video for smoother end.",
        example=3,
    )
    
class AudioOptions(BaseModel):
    voice: str = Field(
        "alloy",
        description="The voice to be used for the audio.",
        example="alloy",
    )

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
    subtitle_options: SubtitleOptions
    video_options: VideoOptions
    audio_options: AudioOptions
    
    class Config:
        str_strip_whitespace = True
