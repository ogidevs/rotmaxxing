# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List, Optional
from fastapi import HTTPException

from server.models.user import User, UserReturn
from server.schemas.user import UserCreateSchema

import hashlib


class Database:
    def __init__(self, db_url: str, db_name: str):
        self.db_url = db_url
        self.db_name = db_name
        self.client = None
        self.db = None
        self.fs = None  # Add GridFS bucket here

    async def connect(self):
        self.client = AsyncIOMotorClient(self.db_url)
        self.db = self.client[self.db_name]

        # Initialize Beanie models
        await init_beanie(self.db, document_models=[User])

    async def close(self):
        self.client.close()


# Initialize the database connection
db = Database(db_url="mongodb://localhost:27017", db_name="brainrot")
fs = db.fs


async def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


async def verify_password(password: str, hashed_password: str) -> bool:
    return await hash_password(password) == hashed_password


async def create_user(user_data: UserCreateSchema) -> UserReturn:
    password = await hash_password(user_data.password)
    if await get_user_by_email(user_data.email) or await get_user_by_username(
        user_data.username
    ):
        raise HTTPException(status_code=400, detail="User already exists")
    user = User(username=user_data.username, email=user_data.email, password=password)
    await user.insert()
    return UserReturn.from_document(user)


async def get_user(user_id: str) -> Optional[UserReturn]:
    user = await User.get(user_id)
    return UserReturn.from_document(user) if user else None


async def get_user_by_email(email: str) -> Optional[UserReturn]:
    user = await User.get_one({"email": email})
    return UserReturn.from_document(user) if user else None


async def get_user_by_username(username: str) -> Optional[UserReturn]:
    user = await User.get_one({"username": username})
    return UserReturn.from_document(user) if user else None


async def get_users() -> List[UserReturn]:
    users = await User.all().to_list()
    return [UserReturn.from_document(user) for user in users]


async def update_user(user_id: str, user_data: UserCreateSchema) -> UserReturn:
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.username:
        user.username = user_data.username
    if user_data.email:
        user.email = user_data.email
    if user_data.password:
        user.password = await hash_password(user_data.password)
    await user.save()
    return UserReturn.from_document(user)


async def delete_user(user_id: str) -> bool:
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user.delete()
    return True
