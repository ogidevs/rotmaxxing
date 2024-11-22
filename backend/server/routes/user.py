# user_routes.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from server.auth.auth_bearer import JWTBearer
from server.database import (
    create_user,
    get_user,
    get_user_by_email,
    get_users,
    update_user,
    delete_user,
)
from server.schemas.user import (
    UserRegisterSchema,
    UserLoginSchema,
    UserResponseSchema,
    UserUpdateSchema,
)
from server.auth.auth_handler import decode_jwt, sign_jwt
from server.utils.hashing import hash_password, verify_password

user_router = APIRouter()


@user_router.post("/register", response_model=UserResponseSchema)
async def create_user_endpoint(user_data: UserRegisterSchema):
    user_data.password = hash_password(user_data.password)
    user = await create_user(user_data)
    user_dict = dict(user)
    user_dict["token"] = sign_jwt(user_dict["id"])["access_token"]
    return user_dict


@user_router.post("/login", response_model=UserResponseSchema)
async def login_user_endpoint(user_data: UserLoginSchema):
    user = await get_user_by_email(user_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    user_dict = dict(user)
    user_dict["token"] = sign_jwt(user_dict["id"])["access_token"]
    return user


@user_router.get(
    "/me", response_model=UserResponseSchema, dependencies=[Depends(JWTBearer())]
)
async def get_user_endpoint(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    user_dict = dict(user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_dict["token"] = token
    return user_dict


@user_router.patch(
    "/me", response_model=UserResponseSchema, dependencies=[Depends(JWTBearer())]
)
async def update_user_endpoint(
    user_data: UserUpdateSchema, token: str = Depends(JWTBearer())
):
    decoded_token = decode_jwt(token)
    user_data.password = await hash_password(user_data.password)
    user = await update_user(decoded_token["user_id"], user_data)
    return user
