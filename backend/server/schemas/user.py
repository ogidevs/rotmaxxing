from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserUpdateSchema(BaseModel):
    password: str = None


class UserResponseSchema(BaseModel):
    id: str = Field(..., alias="_id")  # Map `_id` to `id`
    username: str
    email: str
    token: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True  # Allow using `id` instead of `_id`
