from typing import Optional
from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class User(Document, BaseModel):
    username: str
    email: str
    password: Optional[str] = None
    sub: Optional[str] = None # Sub field for Google OAuth
    credit: Optional[int] = 50
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    class Settings:
        collection = "users"

    class Config:
        from_attributes = True


class UserReturn(BaseModel):
    id: str = Field(..., alias="_id")  # Map `_id` to `id`
    username: str
    email: str
    password: Optional[str] = None
    credit: int

    class Config:
        from_attributes = True
        populate_by_name = True  # Allow using `id` instead of `_id`

    @classmethod
    def from_document(cls, document: User) -> "UserReturn":
        return cls(
            id=str(document.id), username=document.username, email=document.email, password=document.password, credit=document.credit
        )
