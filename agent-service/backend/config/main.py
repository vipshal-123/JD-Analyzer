from decouple import Config, RepositoryEnv

import os

config = Config(RepositoryEnv("local.env"))
CORS_ORIGIN = "http://localhost:3000"

__access_public_key_path = os.path.join(
    os.path.dirname(__file__), "../private/auth_public_key.pem"
)

JWT_ACCESS_KEY_PUBLIC = open(__access_public_key_path, "rb").read()

MONGO_URI = config.get("MONGO_URI")
PORT = config.get("PORT", cast=int)