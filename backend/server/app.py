# main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

from server.database import db
from server.routes.user import user_router
from server.routes.upload import upload_router
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.close()


app = FastAPI(lifespan=lifespan)


app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(upload_router, prefix="/uploads", tags=["uploads"])
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

origins = [
    "localhost",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")


@app.route("/")
async def root():
    return app.responses.FileResponse("../frontend/dist/index.html")
