from pydantic import BaseModel, Field
from typing import Optional
from datetime import timedelta


class UploadSchema(BaseModel):
    title: str = Field(
        ..., description="The title of the upload.", min_length=1, max_length=255
    )
    text: str

    class Config:
        str_strip_whitespace = True


class UploadResponseSchema(BaseModel):
    title: str
    video_result_file: Optional[str]
