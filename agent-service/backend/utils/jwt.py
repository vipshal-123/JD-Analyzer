from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from backend.config import main
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

security = HTTPBearer()
load_dotenv("local.env")

async def verify_jwt_token(token: str) -> dict:
    print("token", token)
    try:
        public_key = serialization.load_pem_public_key(
            main.JWT_ACCESS_KEY_PUBLIC, backend=default_backend()
        )

        public_key_pem_decrypted = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )

        payload = jwt.decode(
            token, public_key_pem_decrypted.decode("utf-8"), algorithms=["RS256"]
        )

        return payload
    except JWTError as e:
        print(e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=403, detail="Authorization token missing")
    
    return await verify_jwt_token(credentials.credentials)
