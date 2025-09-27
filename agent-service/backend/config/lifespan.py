from contextlib import asynccontextmanager

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from backend.config.main import MONGO_URI
from backend.models.Analysis import Analysis
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.db = AsyncIOMotorClient(MONGO_URI)["jd-analyzer"]
    await init_beanie(
        database=app.db,
        document_models=[
            Analysis
        ],
    )
    logging.info("Database initialized")
    yield
    logging.info("Server closed successfully")
