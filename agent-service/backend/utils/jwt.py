from jwt import decode, ExpiredSignatureError, InvalidTokenError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

security = HTTPBearer()
load_dotenv("local.env")

def verify_jwt_token(token: str, token_type: str = "refresh") -> dict:
    try:
        payload = decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
        if payload.get("type") != token_type:
            raise InvalidTokenError("Invalid token type.")
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_jwt_token(credentials.credentials)