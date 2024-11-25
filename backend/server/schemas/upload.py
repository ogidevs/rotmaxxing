from pydantic import BaseModel, Field, model_validator
from typing import Optional, Dict, Any

class SubtitleOptions(BaseModel):
    Name: str = Field(
        "Default",
        description="The name of the subtitle style.",
        example="Default",
    )
    Fontname: str = Field(
        "Montserrat-VariableFont.ttf",
        description="The font file to be used for the subtitles.",
        example="Montserrat-VariableFont.ttf",
    )
    Fontsize: int = Field(
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
    BackColour: str = Field(
        "&H000000&",
        description="The background color in hexadecimal.",
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
    BorderStyle: int = Field(
        1,
        description="The border style (0 or 1).",
        example=1,
    )
    Outline: int = Field(
        2,
        description="The outline width in pixels.",
        example=2,
    )
    Shadow: int = Field(
        1,
        description="The shadow effect (0 or 1).",
        example=1,
    )
    Alignment: str = Field(
        "center",
        description="The subtitle alignment (bottom-center).",
        example="center",
    )
    MarginL: int = Field(
        10,
        description="The left margin in pixels.",
        example=10,
    )
    MarginR: int = Field(
        10,
        description="The right margin in pixels.",
        example=10,
    )
    MarginV: int = Field(
        10,
        description="The vertical margin (distance from bottom).",
        example=10,
    )
    OutlineColour: str = Field(
        "&H000000&",
        description="The outline color in hexadecimal.",
        example="&H000000&",
    )
    Underline: int = Field(
        0,
        description="The underline text (0 or 1).",
        example=0,
    )
    StrikeOut: int = Field(
        0,
        description="The strikeout text (0 or 1).",
        example=0,
    )
    ScaleX: int = Field(
        100,
        description="The horizontal scaling percentage.",
        example=100,
    )
    ScaleY: int = Field(
        100,
        description="The vertical scaling percentage.",
        example=100,
    )
    Spacing: int = Field(
        0,
        description="The spacing between characters.",
        example=0,
    )
    Angle: int = Field(
        0,
        description="The rotation angle of the text.",
        example=0,
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
    video_duration: int = Field(
        20,
        description="The duration of the video.",
        example=20,
    )
    
class AudioOptions(BaseModel):
    voice: str = Field(
        "alloy",
        description="The voice to be used for the audio.",
        example="alloy",
    )

class GenerateBrainrotSchema(BaseModel):
    folder_id: Optional[str] = Field(
        description="The folder ID of the upload.", min_length=1, max_length=255
    )
    text: str = Field(
        ...,
        description="The text to be converted to speech and displayed as subtitles.",
        min_length=1,
        max_length=4000,
    )
    audio_options: AudioOptions
    subtitle_options: SubtitleOptions
    
    
    class Config:
        str_strip_whitespace = True

class GenerateDownloadSchema(BaseModel):
    folder_id: str = Field(
        ..., description="The folder ID of the upload.", min_length=1, max_length=255
    )
    video_options: VideoOptions
    
    class Config:
        str_strip_whitespace = True