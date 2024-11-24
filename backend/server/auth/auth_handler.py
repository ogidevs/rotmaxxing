from typing import Dict
import jwt

import time, os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def sign_jwt(user_id: str) -> Dict[str, str]:
    access_payload = {"user_id": user_id, "expires": time.time() + 900} # 15 minutes
    refresh_payload = {"user_id": user_id, "expires": time.time() + 2592000} # 30 days
    
    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {"access_token": access_token, "refresh_token": refresh_token}


def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return {}