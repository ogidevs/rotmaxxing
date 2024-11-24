# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

import os

from server.rate_limiter import limiter
from server.database import db
from server.routes.user import user_router
from server.routes.upload import upload_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.close()


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(upload_router, prefix="/uploads", tags=["uploads"])
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

origins = [
    os.getenv("FRONTEND_URL"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return RedirectResponse(url="/")

@app.exception_handler(RateLimitExceeded)
async def ratelimit_error(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Try again later."},
    )
