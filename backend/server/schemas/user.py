from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreateSchema(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserUpdateSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserResponseSchema(BaseModel):
    id: str = Field(..., alias="_id")  # Map `_id` to `id`
    username: str
    email: str

    class Config:
        from_attributes = True
        populate_by_name = True  # Allow using `id` instead of `_id`
