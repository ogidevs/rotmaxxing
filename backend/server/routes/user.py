# user_routes.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from server.auth.auth_bearer import JWTBearer
from authlib.integrations.starlette_client import OAuthError
from server.database import (
    create_user,
    create_user_google,
    get_user,
    get_user_by_email,
    get_users,
    update_user,
    delete_user,
)
from server.schemas.user import (
    UserGoogleRegisterSchema,
    UserRegisterSchema,
    UserLoginSchema,
    UserResponseSchema,
    UserUpdateSchema,
)
from server.auth.auth_handler import decode_jwt, sign_jwt
from server.auth.auth_bearer import oauth
from server.utils.hashing import hash_password, verify_password

user_router = APIRouter()


@user_router.post("/register", response_model=UserResponseSchema)
async def create_user_endpoint(user_data: UserRegisterSchema):
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    user_data.password = hash_password(user_data.password)
    user = await create_user(user_data)
    user_dict = dict(user)
    user_dict["token"] = sign_jwt(user_dict["id"])["access_token"]
    return user_dict


@user_router.get("/login/google", include_in_schema=False)
async def google_login(request: Request):
    redirect_uri = request.url_for("auth_google")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@user_router.route("/auth/google", include_in_schema=False)
async def auth_google(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError:
        return RedirectResponse(url="redirect to frontend login page")

    user = token.get("userinfo")
    user = await create_user_google(
        UserGoogleRegisterSchema(
            username=user.get("name"),
            email=user.get("email"),
            sub=user.get("sub"),
            picture=user.get("picture"),
        )
    )
    user_dict = dict(user)
    user_dict["token"] = sign_jwt(user_dict["id"])["access_token"]
    print(user_dict)
    return JSONResponse(content=user_dict)


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


@user_router.post(
    "/logout", include_in_schema=False, dependencies=[Depends(JWTBearer())]
)
async def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie("access_token")
    return response


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
