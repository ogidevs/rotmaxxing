# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List, Optional
from fastapi import HTTPException

from server.models.user import User, UserReturn
from server.utils.hashing import hash_password
from server.schemas.user import UserRegisterSchema, UserGoogleRegisterSchema

import os, random
from bson import ObjectId


class Database:
    def __init__(self, db_url: str, db_name: str):
        self.db_url = db_url
        self.db_name = db_name
        self.client = None
        self.db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(self.db_url)
        self.db = self.client[self.db_name]

        # Initialize Beanie models
        await init_beanie(self.db, document_models=[User])

    async def close(self):
        self.client.close()


# Initialize the database connection
db = Database(db_url=os.getenv("MONGO_URI"), db_name="brainrot")


# User creation logic for standard registration
async def create_user(user_data: UserRegisterSchema) -> UserReturn:
    if await get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=400, detail="User with that email already exists"
        )
    if await get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=400, detail="User with that username already exists"
        )
    if not validate_username(user_data.username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    user_data.password = await hash_password(user_data.password)
    
    user = User(
        username=user_data.username, email=user_data.email, password=user_data.password
    )
    await user.insert()
    return UserReturn.from_document(user)


async def create_user_google(user_data: UserGoogleRegisterSchema) -> UserReturn:
    # Check if the user already exists based on the email or Google sub
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        return UserReturn.from_document(existing_user)

    # Optional: Automatically generate a username if none is provided
    if validate_username(user_data.username):
        username = user_data.username
    else:
        username = generate_username(user_data.email) + str(random.randint(1000, 9999))
    # Ensure the username is unique
    if await get_user_by_username(username):
        raise HTTPException(status_code=400, detail="Username already taken")
    # Create new user
    user = User(
        username=username,
        email=user_data.email,
        sub=user_data.sub,
        picture=user_data.picture,
    )
    await user.insert()
    return UserReturn.from_document(user)


async def get_user(user_id: str) -> Optional[UserReturn]:
    user = await User.find_one({"_id": ObjectId(user_id)})
    return UserReturn.from_document(user) if user else None


async def get_user_by_email(email: str) -> Optional[UserReturn]:
    user = await User.find_one({"email": email})
    return UserReturn.from_document(user) if user else None


async def get_user_by_sub(sub: str) -> Optional[UserReturn]:
    user = await User.find_one({"sub": sub})
    return UserReturn.from_document(user) if user else None


async def get_user_by_username(username: str) -> Optional[UserReturn]:
    user = await User.find_one({"username:": username})
    return UserReturn.from_document(user) if user else None


async def get_users() -> List[UserReturn]:
    users = await User.all().to_list()
    return [UserReturn.from_document(user) for user in users]


async def update_user(user_id: str, user_data: UserRegisterSchema) -> UserReturn:
    user = await User.find_one({"_id": ObjectId(user_id)})
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


def validate_username(username: str) -> bool:
    """
    Validate the username to ensure it doesn't contain invalid characters.
    """
    return username.isalnum() and len(username) > 3


def generate_username(email: str) -> str:
    """Generate a username based on the user's email."""
    return email.split("@")[0]  # Simplified, you can customize this
