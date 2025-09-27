from fastapi import APIRouter

from backend.routes.v1.index import router as v1_router

router = APIRouter()

router.include_router(prefix="/v1", router=v1_router)
