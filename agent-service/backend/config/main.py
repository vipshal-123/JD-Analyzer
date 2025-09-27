from decouple import Config, RepositoryEnv

import os

config = Config(RepositoryEnv("local.env"))
CORS_ORIGIN = "http://localhost:3000"

if os.getenv("ENVIRONMENT") == "STAGE":
    config = Config(RepositoryEnv("stage.env"))
    CORS_ORIGIN = "https://staging.example.com"

if os.getenv("ENVIRONMENT") == "PRODUCTION":
    config = Config(RepositoryEnv("prod.env"))
    CORS_ORIGIN = "https://example.com"

MONGO_URI = config.get("MONGO_URI")
PORT = config.get("PORT", cast=int)