# user_routes.py
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuthError

import json, os

from server.auth.auth_bearer import JWTBearer
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
from server.utils.hashing import verify_password

user_router = APIRouter()


@user_router.post("/register", response_model=UserResponseSchema)
async def register_user_endpoint(user_data: UserRegisterSchema):
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    user = await create_user(user_data)
    user_dict = dict(user)
    tokens = sign_jwt(user_dict["id"])
    response = JSONResponse(content=user_dict, status_code=201)
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="Lax",
    )
    response.set_cookie(
        key="jwt",
        value=tokens["access_token"],
        samesite="Lax",
        secure=True,
    )
    return response


@user_router.post("/login", response_model=UserResponseSchema)
async def login_user_endpoint(user_data: UserLoginSchema):
    user = await get_user_by_email(user_data.email)
    if user is None:
        raise HTTPException(status_code=400, detail="User not found")
    
    user_dict = dict(user)
    if not await verify_password(user_data.password, user_dict["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    
    tokens = sign_jwt(user_dict["id"])
    response = JSONResponse(content=user_dict, status_code=201)
    response.set_cookie(
        key="jwt",
        value=tokens["access_token"],
        samesite="Lax",
        secure=True,
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        samesite="Lax",
        secure=True,
    )
    
    return response


@user_router.get("/login/google", include_in_schema=False)
async def google_login(request: Request):
    redirect_uri = request.url_for("auth_google")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@user_router.route("/auth/google")
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
    tokens = sign_jwt(user_dict["id"])
    user_dict.update(tokens)
    response = RedirectResponse(url=os.getenv("FRONTEND_URL"), status_code=302)
    response.set_cookie(
        key="jwt",
        value=tokens["access_token"],
        samesite="Lax",
        secure=True,
    )
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        samesite="Lax",
        secure=True,
        httponly=True,  # Ensure it's inaccessible to JavaScript
    )
    return response 

@user_router.post("/logout", dependencies=[Depends(JWTBearer())])
async def logout(request: Request, response: Response, token: str = Depends(JWTBearer())):
    response.delete_cookie("jwt")
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}


@user_router.get(
    "/me", response_model=UserResponseSchema, dependencies=[Depends(JWTBearer())]
)
async def get_user_endpoint(token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    return user


@user_router.patch(
    "/me", response_model=UserResponseSchema, dependencies=[Depends(JWTBearer())]
)
async def update_user_endpoint(
    user_data: UserUpdateSchema, token: str = Depends(JWTBearer())
):
    decoded_token = decode_jwt(token)
    user = await update_user(decoded_token["user_id"], user_data)
    return user

@user_router.get("/verify", response_model=UserResponseSchema)
async def verify_user_endpoint(request: Request, token: str = Depends(JWTBearer())):
    decoded_token = decode_jwt(token)
    user = await get_user(decoded_token["user_id"])
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    return user

@user_router.post("/refresh")
async def refresh_access_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found")

    decoded_refresh = decode_jwt(refresh_token)
    if not decoded_refresh:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    user_id = decoded_refresh["user_id"]
    new_tokens = sign_jwt(user_id)
    
    response = JSONResponse(content={"status": "success"}, status_code=201)
    response.set_cookie(
        key="jwt",
        value=new_tokens["access_token"],
        httponly=False,
        secure=True,
        samesite="Lax",
    )
    response.set_cookie(
        key="refresh_token",
        value=new_tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="Lax",
    )
    return response