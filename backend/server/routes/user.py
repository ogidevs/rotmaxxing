# user_routes.py
from typing import List
from fastapi import APIRouter, HTTPException
from server.database import create_user, get_user, get_users, update_user, delete_user
from server.schemas.user import UserCreateSchema, UserResponseSchema, UserUpdateSchema

user_router = APIRouter()


@user_router.post("/", response_model=UserResponseSchema)
async def create_user_endpoint(user_data: UserCreateSchema):
    user = await create_user(user_data)
    return user


@user_router.get("/{user_id}", response_model=UserResponseSchema)
async def get_user_endpoint(user_id: str):
    user = await get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@user_router.get("/", response_model=List[UserResponseSchema])
async def get_users_endpoint():
    users = await get_users()
    return [UserResponseSchema(**user.dict()) for user in users]


@user_router.patch("/{user_id}", response_model=UserResponseSchema)
async def update_user_endpoint(user_id: str, user_data: UserUpdateSchema):
    user = await update_user(user_id, user_data)
    return user


@user_router.delete("/{user_id}")
async def delete_user_endpoint(user_id: str):
    success = await delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}
