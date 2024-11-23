# main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

from server.database import db
from server.routes.user import user_router
from server.routes.upload import upload_router
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))
app.mount("/static/uploads", StaticFiles(directory="/static/uploads"), name="static")

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(upload_router, prefix="/uploads", tags=["uploads"])
