from contextlib import asynccontextmanager

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from backend.config.main import MONGO_URI
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.db = AsyncIOMotorClient(MONGO_URI)["jd-analyzer"]
    await init_beanie(
        database=app.db,
        document_models=[
        ],
    )
    logging.info("Database initialized")
    yield
    logging.info("Server closed successfully")
